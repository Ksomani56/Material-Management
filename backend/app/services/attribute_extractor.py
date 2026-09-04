import re
from typing import Dict, Any, Optional
from app.services.normalization import NormalizationService

class AttributeExtractor:
    NOUN_PATTERNS = [
        r"\b(BALL VALVE|GATE VALVE|GLOBE VALVE|CHECK VALVE|BUTTERFLY VALVE|PLUG VALVE|NEEDLE VALVE|CONTROL VALVE|RELIEF VALVE|SAFETY VALVE)\b",
        r"\b(VALVE)\b",
        r"\b(WELD NECK FLANGE|BLIND FLANGE|SLIP ON FLANGE|SOCKET WELD FLANGE|THREADED FLANGE|LAP JOINT FLANGE)\b",
        r"\b(FLANGE)\b",
        r"\b(SEAMLESS PIPE|ERW PIPE|WELDED PIPE|LINE PIPE|CASING PIPE|TUBING PIPE)\b",
        r"\b(PIPE)\b",
        r"\b(SPIRAL WOUND GASKET|RING JOINT GASKET|FLAT GASKET|RTJ GASKET)\b",
        r"\b(GASKET)\b",
        r"\b(ELBOW|TEE|REDUCER|COUPLING|NIPPLE|CAP|UNION|BEND)\b",
        r"\b(STUD BOLT|HEX BOLT|BOLT|STUD|NUT|WASHER|FASTENER)\b",
        r"\b(CENTRIFUGAL PUMP|PUMP|COMPRESSOR|MOTOR|BEARING|SEAL)\b"
    ]

    MODIFIER_PATTERNS = [
        r"\b(BALL|GATE|GLOBE|CHECK|BUTTERFLY|NEEDLE|PLUG)\b",
        r"\b(WELD NECK|BLIND|SLIP ON|SOCKET WELD|THREADED|LAP JOINT)\b",
        r"\b(SPIRAL WOUND|RING JOINT|COMPRESSED ASBESTOS|NON ASBESTOS)\b",
        r"\b(SEAMLESS|WELDED|ERW|SAW)\b",
        r"\b(HEXAGONAL|HEX|HEAVY HEX)\b",
        r"\b(CONCENTRIC|ECCENTRIC|EQUAL|REDUCING)\b"
    ]

    DIMENSION_PATTERNS = [
        r"\b(\d+(?:\.\d+)?\s*MM\s*X\s*\d+(?:\.\d+)?\s*MM(?:\s*X\s*\d+(?:\.\d+)?\s*MM)?)\b",
        r"\b(\d+(?:/\d+)?\s*(?:\"|INCH|IN|NB|DN\s*\d+))\b",
        r"\b(DN\s*\d+)\b",
        r"\b(\d+(?:\.\d+)?\s*MM)\b",
        r"\b(SCH\s*(?:10|20|30|40|60|80|120|160|STD|XS|XXS))\b"
    ]

    MATERIAL_GRADE_PATTERNS = [
        r"\b(SS\s*316L|SS316L|SS\s*316|SS316|AISI\s*316L|AISI\s*316|SUS\s*316)\b",
        r"\b(SS\s*304L|SS304L|SS\s*304|SS304|AISI\s*304L|AISI\s*304|SUS\s*304)\b",
        r"\b(ASTM\s*A105|A105N|A105|ASTM\s*A216\s*WCB|A216\s*WCB|WCB)\b",
        r"\b(ASTM\s*A350\s*LF2|A350\s*LF2|LF2)\b",
        r"\b(ASTM\s*A182\s*F316L|F316L|F316|F304L|F304)\b",
        r"\b(INCONEL\s*625|INCONEL\s*718|MONEL\s*400|HASTELLOY\s*C276)\b",
        r"\b(DUPLEX\s*2205|SUPER\s*DUPLEX\s*2507|UNS\s*S31803)\b",
        r"\b(STAINLESS STEEL|CARBON STEEL|ALLOY STEEL|CAST IRON|BRONZE|BRASS)\b"
    ]

    PRESSURE_RATING_PATTERNS = [
        r"(?:^|[\s,;(/])(150#|300#|600#|900#|1500#|2500#)(?:[\s,;)/]|$)",
        r"\b(CLASS\s*(?:150|300|600|900|1500|2500))\b",
        r"\b((?:150|300|600|900|1500|2500)\s*LB[S]?)\b",
        r"\b(PN\s*(?:10|16|25|40|64|100))\b",
        r"\b(3000\s*PSI|6000\s*PSI|10000\s*PSI)\b",
        r"(?:^|[\s,;(/])(3000#|6000#)(?:[\s,;)/]|$)"
    ]

    STANDARD_PATTERNS = [
        r"\b(ASME\s*B16\.5|ASME\s*B16\.9|ASME\s*B16\.10|ASME\s*B16\.34|ASME\s*B16\.47)\b",
        r"\b(API\s*6D|API\s*600|API\s*602|API\s*598|API\s*5L)\b",
        r"\b(ASTM\s*A105|ASTM\s*A216|ASTM\s*A312|ASTM\s*A182)\b",
        r"\b(BS\s*5351|BS\s*1868|BS\s*1873)\b",
        r"\b(DIN\s*\d+|IS\s*\d+)\b"
    ]

    INVERTED_NOUN_PATTERNS = [
        (r"\bVALVE\s+(BALL|GATE|GLOBE|CHECK|BUTTERFLY|PLUG|NEEDLE|CONTROL|RELIEF|SAFETY)\b", r"\1 VALVE"),
        (r"\bFLANGE\s+(WELD\s*NECK|BLIND|SLIP\s*ON|SOCKET\s*WELD|THREADED|LAP\s*JOINT)\b", r"\1 FLANGE"),
        (r"\bGASKET\s+(SPIRAL\s*WOUND|RING\s*JOINT|FLAT|RTJ)\b", r"\1 GASKET"),
        (r"\bPIPE\s+(SEAMLESS|ERW|WELDED|LINE|CASING|TUBING)\b", r"\1 PIPE"),
        (r"\bBOLT\s+(STUD|HEX|HEAVY\s*HEX)\b", r"\1 BOLT"),
    ]

    @classmethod
    def extract_attributes(cls, text: str, spec_text: Optional[str] = None) -> Dict[str, Any]:
        combined = text
        if spec_text:
            combined = f"{text} {spec_text}"
        
        normalized = NormalizationService.normalize_text(combined)

        noun = None
        for inv_pat, repl in cls.INVERTED_NOUN_PATTERNS:
            inv_match = re.search(inv_pat, normalized, re.IGNORECASE)
            if inv_match:
                noun = re.sub(inv_pat, repl, inv_match.group(0), flags=re.IGNORECASE).strip()
                break

        if not noun:
            for pattern in cls.NOUN_PATTERNS:
                match = re.search(pattern, normalized, re.IGNORECASE)
                if match:
                    noun = match.group(1).strip()
                    break

        modifier = None
        for pattern in cls.MODIFIER_PATTERNS:
            match = re.search(pattern, normalized, re.IGNORECASE)
            if match:
                modifier = match.group(1).strip()
                break

        dimensions = None
        dim_matches = []
        for pattern in cls.DIMENSION_PATTERNS:
            for match in re.finditer(pattern, normalized, re.IGNORECASE):
                dim_matches.append(match.group(1).strip())
        if dim_matches:
            dimensions = " ".join(sorted(list(set(dim_matches)), key=len, reverse=True)[:2])
            dimensions = NormalizationService.standardize_dimension(dimensions)

        material_grade = None
        for pattern in cls.MATERIAL_GRADE_PATTERNS:
            match = re.search(pattern, normalized, re.IGNORECASE)
            if match:
                material_grade = match.group(1).strip()
                break

        pressure_rating = None
        for pattern in cls.PRESSURE_RATING_PATTERNS:
            match = re.search(pattern, normalized, re.IGNORECASE)
            if match:
                raw_pr = match.group(1).strip()
                pressure_rating = NormalizationService.standardize_pressure_rating(raw_pr)
                break

        standard = None
        for pattern in cls.STANDARD_PATTERNS:
            match = re.search(pattern, normalized, re.IGNORECASE)
            if match:
                standard = match.group(1).strip()
                break

        canonical_description = cls.generate_canonical_description(
            noun=noun,
            modifier=modifier,
            dimensions=dimensions,
            material_grade=material_grade,
            pressure_rating=pressure_rating,
            standard=standard
        )

        return {
            "noun": noun,
            "modifier": modifier,
            "dimensions": dimensions,
            "material_grade": material_grade,
            "pressure_rating": pressure_rating,
            "standard": standard,
            "canonical_description": canonical_description
        }

    @classmethod
    def generate_canonical_description(
        cls,
        noun: Optional[str],
        modifier: Optional[str],
        dimensions: Optional[str],
        material_grade: Optional[str],
        pressure_rating: Optional[str],
        standard: Optional[str]
    ) -> str:
        parts = []
        if noun:
            parts.append(noun)
        if modifier and (not noun or modifier not in noun):
            parts.append(modifier)
        if dimensions:
            parts.append(dimensions)
        if material_grade:
            parts.append(material_grade)
        if pressure_rating:
            parts.append(pressure_rating)
        if standard:
            parts.append(standard)
            
        if not parts:
            return "UNCLASSIFIED INDUSTRIAL MATERIAL"
        return ", ".join(parts)
