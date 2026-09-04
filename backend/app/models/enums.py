from enum import Enum

class RelationshipType(str, Enum):
    IDENTICAL = "IDENTICAL"
    DUPLICATE = "DUPLICATE"
    NEAR_DUPLICATE = "NEAR_DUPLICATE"
    FUNCTIONALLY_EQUIVALENT = "FUNCTIONALLY_EQUIVALENT"
    RELATED = "RELATED"

class CNMCLifecycleStatus(str, Enum):
    PROPOSED = "PROPOSED"
    RESERVED = "RESERVED"
    APPROVED = "APPROVED"
    DEPRECATED = "DEPRECATED"
    RETIRED = "RETIRED"

class GroupStatus(str, Enum):
    PROPOSED = "PROPOSED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SPLIT = "SPLIT"

class MappingStatus(str, Enum):
    PROPOSED = "PROPOSED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class RationalizationAction(str, Enum):
    MAP = "MAP"
    MERGE = "MERGE"
    RETAIN = "RETAIN"
    RETIRE = "RETIRE"
    REVIEW = "REVIEW"
    SPLIT = "SPLIT"

class MigrationStatus(str, Enum):
    PENDING = "PENDING"
    EXPORTED = "EXPORTED"
    APPLIED = "APPLIED"
    FAILED = "FAILED"
    CONFIRMED = "CONFIRMED"
