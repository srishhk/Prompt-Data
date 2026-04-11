from fastapi import APIRouter, HTTPException
from models.schemas import GenerateRequest, GenerateResponse
from ml.schema_inferrer import infer_schema
from ml.row_generator import generate_rows

router = APIRouter()

@router.post("/generate", response_model=GenerateResponse)
async def generate_dataset(request: GenerateRequest):
    try:
        schema = infer_schema(request.prompt)
        df = generate_rows(schema, request.n_rows)
        rows = df.to_dict(orient="records")
        return GenerateResponse(
            schema_json=schema,
            rows=rows,
            columns=list(df.columns)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
