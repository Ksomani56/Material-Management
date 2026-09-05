import re
from typing import Dict

class NormalizationService:
    ABBREVIATION_DICT: Dict[str, str] = {
        "SS": "STAINLESS STEEL",
        "SST": "STAINLESS STEEL",
        "CS": "CARBON STEEL",
        "CI": "CAST IRON",
        "DI": "DUCTILE IRON",
        "BRS": "BRASS",
        "COP": "COPPER",
        "TI": "TITANIUM",
        "VLV": "VALVE",
        "FLG": "FLANGE",
        "GSKT": "GASKET",
        "BLT": "BOLT",
        "SCRW": "SCREW",
        "FIT": "FITTING",
        "DIA": "DIAMETER",
        "THK": "THICKNESS",
        "LG": "LENGTH",
        "OD": "OUTSIDE DIAMETER",
        "ID": "INSIDE DIAMETER",
        "SCH": "SCHEDULE",
        "CL": "CLASS",
        "CLS": "CLASS",
        "SW": "SOCKET WELD",
        "BW": "BUTT WELD",
        "NPT": "NATIONAL PIPE THREAD",
        "RF": "RAISED FACE",
        "FF": "FLAT FACE",
        "RTJ": "RING TYPE JOINT",
        "GALV": "GALVANIZED",
        "HEX": "HEXAGONAL",
        "STD": "STANDARD",
        "TEMP": "TEMPERATURE",
        "PRESS": "PRESSURE",
        "ELEM": "ELEMENT",
        "ASSY": "ASSEMBLY",
        "REQ": "REQUIRED",
        "QTY": "QUANTITY"
    }

    UOM_DICT: Dict[str, str] = {
        "NOS": "EA",
        "NO": "EA",
        "NOS.": "EA",
        "NUMBER": "EA",
        "NUMBERS": "EA",
        "EACH": "EA",
        "EA": "EA",
        "PC": "EA",
        "PCS": "EA",
        "PIECE": "EA",
        "PIECES": "EA",
        "MTR": "MTR",
        "M": "MTR",
        "METER": "MTR",
        "METERS": "MTR",
        "KG": "KG",
        "KGS": "KG",
        "KILOGRAM": "KG",
        "KILOGRAMS": "KG",
        "SET": "SET",
        "SETS": "SET",
        "LOT": "LOT",
        "LTR": "LTR",
        "LITRE": "LTR",
        "LITRES": "LTR",
        "BOX": "BOX",
        "ROLL": "ROLL"
    }

    DIMENSION_INCH_MAP: Dict[str, str] = {
        '1/2"': '1/2 INCH (DN15)',
        '1/2 INCH': '1/2 INCH (DN15)',
        '1/2IN': '1/2 INCH (DN15)',
        '3/4"': '3/4 INCH (DN20)',
        '3/4 INCH': '3/4 INCH (DN20)',
        '1"': '1 INCH (DN25)',
        '1 INCH': '1 INCH (DN25)',
        '1-1/2"': '1-1/2 INCH (DN40)',
        '1.5"': '1-1/2 INCH (DN40)',
        '2"': '2 INCH (DN50)',
        '2 INCH': '2 INCH (DN50)',
        '2IN': '2 INCH (DN50)',
        '3"': '3 INCH (DN80)',
        '3 INCH': '3 INCH (DN80)',
        '4"': '4 INCH (DN100)',
        '4 INCH': '4 INCH (DN100)',
        '6"': '6 INCH (DN150)',
        '6 INCH': '6 INCH (DN150)',
        '8"': '8 INCH (DN200)',
        '8 INCH': '8 INCH (DN200)',
        '10"': '10 INCH (DN250)',
        '10 INCH': '10 INCH (DN250)',
        '12"': '12 INCH (DN300)',
        '12 INCH': '12 INCH (DN300)'
    }

    @classmethod
    def normalize_text(cls, text: str) -> str:
        if not text:
            return ""
        
        normalized = text.upper()
        normalized = re.sub(r'[\r\n\t]+', ' ', normalized)
        normalized = re.sub(r'[,;:/_\\|-]+', ' ', normalized)
        
        tokens = normalized.split()
        expanded_tokens = []
        for token in tokens:
            token_clean = re.sub(r'[^A-Z0-9\"#.]', '', token)
            if token_clean in cls.ABBREVIATION_DICT:
                expanded_tokens.append(cls.ABBREVIATION_DICT[token_clean])
            else:
                expanded_tokens.append(token)
                
        cleaned = " ".join(expanded_tokens)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        return cleaned

    @classmethod
    def normalize_uom(cls, uom: str) -> str:
        if not uom:
            return "EA"
        clean = uom.strip().upper().replace(".", "")
        return cls.UOM_DICT.get(clean, clean)

    @classmethod
    def standardize_dimension(cls, dim_text: str) -> str:
        if not dim_text:
            return ""
        cleaned = dim_text.strip().upper()
        return cls.DIMENSION_INCH_MAP.get(cleaned, cleaned)

    GRADE_ALIAS_MAP: Dict[str, str] = {
        "WCB": "ASTM A216 WCB",
        "A216 WCB": "ASTM A216 WCB",
        "ASTM A216 WCB": "ASTM A216 WCB",
        "A216-WCB": "ASTM A216 WCB",
        "CS WCB": "ASTM A216 WCB",
        "A105": "ASTM A105",
        "A105N": "ASTM A105",
        "ASTM A105": "ASTM A105",
        "ASTM A105N": "ASTM A105",
        "LF2": "ASTM A350 LF2",
        "A350 LF2": "ASTM A350 LF2",
        "ASTM A350 LF2": "ASTM A350 LF2",
        "A350-LF2": "ASTM A350 LF2",
        "SS316": "SS 316 / ASTM A182 F316",
        "SS 316": "SS 316 / ASTM A182 F316",
        "SS316L": "SS 316 / ASTM A182 F316",
        "SS 316L": "SS 316 / ASTM A182 F316",
        "AISI 316": "SS 316 / ASTM A182 F316",
        "AISI 316L": "SS 316 / ASTM A182 F316",
        "SUS 316": "SS 316 / ASTM A182 F316",
        "SUS 316L": "SS 316 / ASTM A182 F316",
        "ASTM A182 F316": "SS 316 / ASTM A182 F316",
        "ASTM A182 F316L": "SS 316 / ASTM A182 F316",
        "A182 F316": "SS 316 / ASTM A182 F316",
        "A182 F316L": "SS 316 / ASTM A182 F316",
        "F316": "SS 316 / ASTM A182 F316",
        "F316L": "SS 316 / ASTM A182 F316",
        "316 SS": "SS 316 / ASTM A182 F316",
        "316L SS": "SS 316 / ASTM A182 F316",
        "SS304": "SS 304 / ASTM A182 F304",
        "SS 304": "SS 304 / ASTM A182 F304",
        "SS304L": "SS 304 / ASTM A182 F304",
        "SS 304L": "SS 304 / ASTM A182 F304",
        "AISI 304": "SS 304 / ASTM A182 F304",
        "AISI 304L": "SS 304 / ASTM A182 F304",
        "SUS 304": "SS 304 / ASTM A182 F304",
        "ASTM A182 F304": "SS 304 / ASTM A182 F304",
        "ASTM A182 F304L": "SS 304 / ASTM A182 F304",
        "A182 F304": "SS 304 / ASTM A182 F304",
        "F304": "SS 304 / ASTM A182 F304",
        "F304L": "SS 304 / ASTM A182 F304",
        "304 SS": "SS 304 / ASTM A182 F304",
        "INCONEL 625": "INCONEL 625",
        "INCONEL625": "INCONEL 625",
        "ALLOY 625": "INCONEL 625",
        "INCONEL 718": "INCONEL 718",
        "INCONEL718": "INCONEL 718",
        "ALLOY 718": "INCONEL 718",
        "MONEL 400": "MONEL 400",
        "MONEL400": "MONEL 400",
        "ALLOY 400": "MONEL 400",
        "HASTELLOY C276": "HASTELLOY C276",
        "HASTELLOY C-276": "HASTELLOY C276",
        "C276": "HASTELLOY C276",
        "DUPLEX 2205": "DUPLEX 2205",
        "2205 DUPLEX": "DUPLEX 2205",
        "UNS S31803": "DUPLEX 2205",
        "SUPER DUPLEX 2507": "SUPER DUPLEX 2507",
        "2507": "SUPER DUPLEX 2507",
        "STAINLESS STEEL": "STAINLESS STEEL",
        "CARBON STEEL": "CARBON STEEL",
        "ALLOY STEEL": "ALLOY STEEL",
        "CAST IRON": "CAST IRON",
        "BRONZE": "BRONZE",
        "BRASS": "BRASS"
    }

    PRESSURE_RATINGS_STANDARD: Dict[str, str] = {
        "150": "150#",
        "150#": "150#",
        "150LB": "150#",
        "150LBS": "150#",
        "CLASS150": "150#",
        "300": "300#",
        "300#": "300#",
        "300LB": "300#",
        "300LBS": "300#",
        "CLASS300": "300#",
        "600": "600#",
        "600#": "600#",
        "600LB": "600#",
        "600LBS": "600#",
        "CLASS600": "600#",
        "900": "900#",
        "900#": "900#",
        "900LB": "900#",
        "900LBS": "900#",
        "CLASS900": "900#",
        "1500": "1500#",
        "1500#": "1500#",
        "1500LB": "1500#",
        "1500LBS": "1500#",
        "CLASS1500": "1500#",
        "2500": "2500#",
        "2500#": "2500#",
        "2500LB": "2500#",
        "2500LBS": "2500#",
        "CLASS2500": "2500#",
        "3000#": "3000#",
        "3000PSI": "3000#",
        "6000#": "6000#",
        "6000PSI": "6000#",
        "PN10": "PN 10",
        "PN16": "PN 16",
        "PN25": "PN 25",
        "PN40": "PN 40",
        "PN64": "PN 64",
        "PN100": "PN 100"
    }

    @classmethod
    def canonicalize_material_grade(cls, grade_str: str) -> str:
        if not grade_str:
            return ""
        cleaned = re.sub(r'[\r\n\t]+', ' ', str(grade_str).upper()).strip()
        cleaned = re.sub(r'[\-_]', ' ', cleaned)
        cleaned = re.sub(r'\s+', ' ', cleaned)
        if cleaned in cls.GRADE_ALIAS_MAP:
            return cls.GRADE_ALIAS_MAP[cleaned]
        no_space = cleaned.replace(" ", "")
        for k, v in cls.GRADE_ALIAS_MAP.items():
            if k.replace(" ", "") == no_space:
                return v
        return cleaned

    @classmethod
    def standardize_pressure_rating(cls, pr_str: str) -> str:
        if not pr_str:
            return ""
        cleaned = re.sub(r'[\s\-]+', '', str(pr_str).upper()).strip()
        return cls.PRESSURE_RATINGS_STANDARD.get(cleaned, str(pr_str).strip().upper())
