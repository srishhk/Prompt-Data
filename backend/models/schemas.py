from pydantic import BaseModel
from typing import Any

class GenerateRequest(BaseModel):
    prompt: str
    n_rows: int = 100

class GenerateResponse(BaseModel):
    schema_json: dict
    rows: list[dict[str, Any]]
    columns: list[str]