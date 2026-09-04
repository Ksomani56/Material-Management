from typing import Tuple

class TaxonomyService:
    TAXONOMY_MAP = {
        "VALVE": ("40141600", "Valves and actuators"),
        "FLANGE": ("40141700", "Pipe fittings, flanges and joints"),
        "PIPE": ("40142100", "Pipes and tubing"),
        "GASKET": ("31181500", "Gaskets and packings"),
        "PUMP": ("40151500", "Pumps and compressors"),
        "BOLT": ("31161500", "Fasteners and bolts"),
        "FASTENER": ("31161500", "Fasteners and bolts")
    }

    @classmethod
    def classify(cls, noun: str = None) -> Tuple[str, str]:
        if not noun:
            return "23150000", "General industrial machinery and accessories"
            
        noun_upper = noun.upper()
        for key, (unspsc, label) in cls.TAXONOMY_MAP.items():
            if key in noun_upper:
                return unspsc, label
                
        return "23150000", "General industrial machinery and accessories"
