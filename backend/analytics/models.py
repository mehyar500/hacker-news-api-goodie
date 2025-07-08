# analytics/models.py
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime

class StorySchema(BaseModel):
    # Match the Django ORM field `hn_id`
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
        orm_mode = True                           # Enable ORM → Pydantic conversion
        allow_population_by_field_name = True     # Accept `hn_id` or `id` when populating

