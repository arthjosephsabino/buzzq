import enum

class QueueStatus(str, enum.Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    INACTIVE = "INACTIVE"

class QueueEntryStatus(str, enum.Enum):
    NEW = "NEW"
    CURRENT = "CURRENT"
    IN_QUEUE = "IN_QUEUE"
    CUT_OFF = "CUT_OFF"
    DONE = "DONE"
    
class PersonnelRole(str, enum.Enum):
    OWNER = "OWNER"
    STAFF = "STAFF"