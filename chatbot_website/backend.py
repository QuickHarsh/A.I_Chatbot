from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict
import ollama
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
current_dir = os.path.dirname(os.path.realpath(__file__))

app.mount("/static", StaticFiles(directory=current_dir), name="static")

MAX_HISTORY_SIZE = 10
chat_history: List[Dict[str, str]] = []

@app.get("/", response_class=HTMLResponse)
async def root():
    try:
        with open(os.path.join(current_dir, 'index.html'), 'r') as f:
            return HTMLResponse(content=f.read())
    except Exception as e:
        logger.error(f"Error reading index.html: {str(e)}")
        raise HTTPException(status_code=500, detail="Error loading the page")

@app.get("/styles.css")
async def styles():
    return FileResponse(
        os.path.join(current_dir, 'styles.css'),
        media_type='text/css'
    )

@app.get("/lallu.js")
async def javascript():
    return FileResponse(
        os.path.join(current_dir, 'lallu.js'),
        media_type='application/javascript'
    )

class ChatRequest(BaseModel):
    user_message: str

@app.post("/chat/")
async def chat(request: ChatRequest):
    try:
        chat_history.append({"role": "user", "content": request.user_message})
        if len(chat_history) > MAX_HISTORY_SIZE:
            chat_history.pop(0)

        logger.info(f"Processing user message: {request.user_message}")
        
        response = ollama.chat(model="llama2", messages=chat_history)
        
        if not response or "message" not in response:
            raise HTTPException(status_code=500, detail="Invalid response from Ollama API")

        ai_response = response["message"]["content"]
        chat_history.append({"role": "assistant", "content": ai_response})
        
        logger.info(f"AI Response: {ai_response}")
        return {"response": ai_response}

    except ollama.ResponseError as e:
        logger.error(f"Ollama API Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error communicating with Ollama API")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

#uvicorn backend:app --reload --> to start the server