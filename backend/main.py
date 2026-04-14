from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import generate, export, library

app = FastAPI(title="PromptData API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(library.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "PromptData API is running"}