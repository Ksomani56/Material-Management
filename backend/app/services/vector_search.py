import threading
import logging
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from app.core.config import settings

logger = logging.getLogger("vector_search")

try:
    import faiss
    from sentence_transformers import SentenceTransformer
    HAS_FAISS_TRANSFORMERS = True
except ImportError:
    HAS_FAISS_TRANSFORMERS = False

class VectorSearchService:
    _instance: Optional["VectorSearchService"] = None
    _lock: threading.Lock = threading.Lock()

    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL_NAME
        self.dimension = settings.EMBEDDING_DIMENSION
        self.has_neural = HAS_FAISS_TRANSFORMERS
        self.model = None
        self._rw_lock = threading.Lock()
        
        self.id_map: Dict[int, str] = {}
        self.reverse_map: Dict[str, int] = {}
        self.indexed_texts: List[str] = []

        if self.has_neural:
            try:
                self.model = SentenceTransformer(self.model_name)
                self.index = faiss.IndexFlatIP(self.dimension)
            except Exception as e:
                logger.warning(f"Failed to initialize SentenceTransformer/FAISS: {e}. Falling back to n-gram vectors.")
                self.has_neural = False

        if not self.has_neural:
            self.vectors: Optional[np.ndarray] = None

    @classmethod
    def get_instance(cls) -> "VectorSearchService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = VectorSearchService()
            return cls._instance

    def _pseudo_vectorize(self, text: str) -> np.ndarray:
        """Lightweight 384-d deterministic character n-gram hash vector normalized to unit length."""
        v = np.zeros(self.dimension, dtype=np.float32)
        words = str(text).lower().split()
        for i, w in enumerate(words):
            h = hash(w) % self.dimension
            v[h] += 1.0 + (1.0 / (i + 1))
            for k in range(len(w) - 2):
                tri = hash(w[k:k+3]) % self.dimension
                v[tri] += 0.5
        norm = np.linalg.norm(v)
        if norm > 0:
            v /= norm
        return v

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)
        clean_texts = [str(t) if t else "" for t in texts]

        if self.has_neural and self.model:
            try:
                embeddings = self.model.encode(
                    clean_texts,
                    normalize_embeddings=True,
                    show_progress_bar=False
                )
                return np.array(embeddings, dtype=np.float32)
            except Exception:
                pass

        # Fallback to pseudo-vectorizer
        embs = np.array([self._pseudo_vectorize(t) for t in clean_texts], dtype=np.float32)
        return embs

    def calculate_pairwise_similarity(self, text1: str, text2: str) -> float:
        if not text1 or not text2:
            return 0.0
        embs = self.generate_embeddings([text1, text2])
        sim = float(np.dot(embs[0], embs[1]))
        return max(0.0, min(1.0, round(sim, 4)))

    def clear_index(self):
        with self._rw_lock:
            if self.has_neural and hasattr(self, "index"):
                self.index = faiss.IndexFlatIP(self.dimension)
            self.id_map.clear()
            self.reverse_map.clear()
            self.indexed_texts.clear()
            self.vectors = None

    def index_materials(self, materials: List[Dict[str, Any]]):
        if not materials:
            return

        with self._rw_lock:
            new_materials = [m for m in materials if m["id"] not in self.reverse_map]
            if not new_materials:
                return

            texts = [m.get("text", "") for m in new_materials]
            embs = self.generate_embeddings(texts)

            if self.has_neural and hasattr(self, "index"):
                start_idx = self.index.ntotal
                self.index.add(embs)
            else:
                start_idx = len(self.indexed_texts)
                if self.vectors is None:
                    self.vectors = embs
                else:
                    self.vectors = np.vstack([self.vectors, embs])

            for offset, m in enumerate(new_materials):
                curr_idx = start_idx + offset
                m_id = m["id"]
                self.id_map[curr_idx] = m_id
                self.reverse_map[m_id] = curr_idx
                self.indexed_texts.append(m.get("text", ""))

    def retrieve_candidates(self, query_text: str, k: int = 10) -> List[Tuple[str, float]]:
        if not query_text:
            return []

        with self._rw_lock:
            total = self.index.ntotal if (self.has_neural and hasattr(self, "index")) else (len(self.indexed_texts))
            if total == 0:
                return []

            query_emb = self.generate_embeddings([query_text])
            k = min(k, total)

            if self.has_neural and hasattr(self, "index"):
                D, I = self.index.search(query_emb, k)
                results: List[Tuple[str, float]] = []
                for score, idx in zip(D[0], I[0]):
                    if idx != -1 and idx in self.id_map:
                        results.append((self.id_map[idx], float(score)))
                return results
            else:
                # Numpy cosine dot product
                sims = np.dot(self.vectors, query_emb[0])
                top_indices = np.argsort(sims)[::-1][:k]
                return [(self.id_map[idx], float(sims[idx])) for idx in top_indices if idx in self.id_map]

    def get_status(self) -> Dict[str, Any]:
        with self._rw_lock:
            total = self.index.ntotal if (self.has_neural and hasattr(self, "index")) else len(self.indexed_texts)
            return {
                "model_name": self.model_name,
                "dimension": self.dimension,
                "total_indexed_vectors": total,
                "index_type": "faiss.IndexFlatIP" if self.has_neural else "numpy.CosineMatrix",
                "similarity_metric": "Cosine Similarity (Normalized Dot Product)",
                "engine": "Neural (FAISS)" if self.has_neural else "Deterministic N-Gram Vectorizer"
            }

