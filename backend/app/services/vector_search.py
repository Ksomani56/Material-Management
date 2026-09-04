import threading
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from app.core.config import settings

class VectorSearchService:
    _instance: Optional["VectorSearchService"] = None
    _lock: threading.Lock = threading.Lock()

    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL_NAME
        self.dimension = settings.EMBEDDING_DIMENSION
        self.model: Optional[SentenceTransformer] = None
        self._load_model()
        
        # FAISS inner-product index (cosine similarity for normalized vectors)
        self.index = faiss.IndexFlatIP(self.dimension)
        self.id_map: Dict[int, str] = {}
        self.reverse_map: Dict[str, int] = {}
        self._rw_lock = threading.Lock()

    def _load_model(self):
        if self.model is None:
            self.model = SentenceTransformer(self.model_name)

    @classmethod
    def get_instance(cls) -> "VectorSearchService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = VectorSearchService()
            return cls._instance

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        if not texts:
            return np.empty((0, self.dimension), dtype=np.float32)
        clean_texts = [str(t) if t else "" for t in texts]
        embeddings = self.model.encode(
            clean_texts,
            normalize_embeddings=True,
            show_progress_bar=False
        )
        return np.array(embeddings, dtype=np.float32)

    def calculate_pairwise_similarity(self, text1: str, text2: str) -> float:
        if not text1 or not text2:
            return 0.0
        embs = self.generate_embeddings([text1, text2])
        sim = float(np.dot(embs[0], embs[1]))
        return max(0.0, min(1.0, round(sim, 4)))

    def clear_index(self):
        with self._rw_lock:
            self.index = faiss.IndexFlatIP(self.dimension)
            self.id_map.clear()
            self.reverse_map.clear()

    def index_materials(self, materials: List[Dict[str, Any]]):
        """
        Index a batch of materials. Each dictionary must have 'id' and 'text'.
        """
        if not materials:
            return

        with self._rw_lock:
            # Avoid duplicate indexing
            new_materials = [m for m in materials if m["id"] not in self.reverse_map]
            if not new_materials:
                return

            texts = [m.get("text", "") for m in new_materials]
            embs = self.generate_embeddings(texts)

            start_idx = self.index.ntotal
            self.index.add(embs)

            for offset, m in enumerate(new_materials):
                curr_idx = start_idx + offset
                m_id = m["id"]
                self.id_map[curr_idx] = m_id
                self.reverse_map[m_id] = curr_idx

    def retrieve_candidates(self, query_text: str, k: int = 10) -> List[Tuple[str, float]]:
        """
        Retrieve top-K semantic candidates using FAISS KNN search.
        Returns list of (material_id, similarity_score).
        """
        if self.index.ntotal == 0 or not query_text:
            return []

        query_emb = self.generate_embeddings([query_text])
        k = min(k, self.index.ntotal)

        with self._rw_lock:
            D, I = self.index.search(query_emb, k)

        results: List[Tuple[str, float]] = []
        for score, idx in zip(D[0], I[0]):
            if idx != -1 and idx in self.id_map:
                results.append((self.id_map[idx], float(score)))

        return results

    def get_status(self) -> Dict[str, Any]:
        with self._rw_lock:
            return {
                "model_name": self.model_name,
                "dimension": self.dimension,
                "total_indexed_vectors": self.index.ntotal,
                "index_type": "faiss.IndexFlatIP",
                "similarity_metric": "Cosine Similarity (Normalized Dot Product)"
            }
