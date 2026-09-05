import pytest
import numpy as np
from app.services.vector_search import VectorSearchService

def test_vector_search_service_initialization():
    svc = VectorSearchService.get_instance()
    status = svc.get_status()
    assert "custom-material-embedder" in status["model_name"] or status["model_name"] == "all-MiniLM-L6-v2"
    assert status["dimension"] == 384
    assert status["index_type"] == "faiss.IndexFlatIP"

def test_embedding_generation_and_dimension():
    svc = VectorSearchService.get_instance()
    texts = [
        "BALL VALVE 2IN 150# CS BODY ASTM A216 WCB RF FLANGED",
        "VLV BALL 2 INCH 150 LB WCB FLG RF"
    ]
    embs = svc.generate_embeddings(texts)
    assert embs.shape == (2, 384)
    # Check L2 normalization (norm should be ~1.0)
    norm1 = np.linalg.norm(embs[0])
    norm2 = np.linalg.norm(embs[1])
    assert pytest.approx(norm1, 0.01) == 1.0
    assert pytest.approx(norm2, 0.01) == 1.0

def test_faiss_knn_indexing_and_retrieval():
    svc = VectorSearchService.get_instance()
    svc.clear_index()

    materials = [
        {"id": "mat-valve-1", "text": "BALL VALVE 2IN 150# CS BODY ASTM A216 WCB"},
        {"id": "mat-valve-2", "text": "VLV BALL 2 INCH 150 LB WCB FLG"},
        {"id": "mat-pipe-1", "text": "SEAMLESS PIPE 4IN SCH40 ASTM A106 GRADE B"},
        {"id": "mat-flange-1", "text": "WELD NECK FLANGE 2IN 150# ASTM A105 RF SCH40"}
    ]
    svc.index_materials(materials)
    status = svc.get_status()
    assert status["total_indexed_vectors"] == 4

    # Query for valve with rating
    candidates = svc.retrieve_candidates("BALL VALVE 2 INCH 150# WCB", k=2)
    assert len(candidates) == 2
    top_id, top_score = candidates[0]
    assert top_id in ["mat-valve-1", "mat-valve-2"]
    assert top_score > 0.60
