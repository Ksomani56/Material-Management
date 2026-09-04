from typing import List, Dict, Any

class ERPIntegrationPort:
    def format_migration_payload(self, approved_mappings: List[Dict[str, Any]]) -> Any:
        raise NotImplementedError
