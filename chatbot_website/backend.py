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

chat_history = []

class ChatRequest(BaseModel):
    user_message: str

@app.post("/chat/")
async def chat(request: ChatRequest):
    try:
        chat_history.append({"role": "user", "content": request.user_message})

        response = ollama.chat(model="llama3.2", messages=chat_history)

        ai_response = response["message"]["content"]
        chat_history.append({"role": "assistant", "content": ai_response})

        print("Ollama Response:", ai_response)

        return {"response": ai_response}

    except Exception as e:
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
