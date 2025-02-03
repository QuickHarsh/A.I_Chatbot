from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_message: str

@app.post("/chat/")
async def chat(request: ChatRequest):
    try:
        response = ollama.chat(model="llama3.2", messages=[{"role": "user", "content": request.user_message}])
        
        print("Ollama Response:", response)

        return {"response": response["message"]["content"]}
    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
