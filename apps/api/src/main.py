from fastapi import FastAPI
from sqlalchemy import text
from .db import Session

app = FastAPI()

@app.get("/health")
async def health():
    async with Session() as s:
        await s.execute(text("SELECT 1"))
    return {"status": "ok"}