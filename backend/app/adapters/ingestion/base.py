from typing import List, Dict, Any, Tuple
from app.schemas.cpse_material import RowValidationError

class CatalogIngestionPort:
    def parse_and_validate(
        self, file_content: bytes, filename: str
    ) -> Tuple[List[Dict[str, Any]], List[RowValidationError]]:
        raise NotImplementedError
