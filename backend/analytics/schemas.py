# analytics/schemas.py
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime

class StorySchema(BaseModel):
    hn_id: int = Field(..., alias='id')
    title: str
    url: HttpUrl | None
    time: datetime
    score: int
    descendants: int
    by: str
    domain: str
    keywords: list[str]

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2
        validate_by_name = True # replaces allow_population_by_field_name
