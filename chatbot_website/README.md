# LAPPU AI Chatbot

A modern web-based chatbot interface powered by Ollama's language models. Built with FastAPI, TailwindCSS, and vanilla JavaScript.

![LAPPU AI Interface](https://cdn-icons-png.flaticon.com/512/4712/4712035.png)

## Features

- 🤖 AI-powered chat interface using Ollama's language models
- 🌓 Dark/Light mode support
- 💬 Real-time chat with typing indicators
- 🎨 Modern UI with TailwindCSS
- ⚡ Fast and lightweight
- 🔄 Chat history management

## Prerequisites

- Python 3.8+
- [Ollama](https://ollama.ai/) installed and running
- Node.js and npm (for TailwindCSS)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/lappu-ai-chatbot.git
cd lappu-ai-chatbot
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Make sure Ollama is running and the llama2 model is pulled:
```bash
ollama pull llama2
```

4. Start the server:
```bash
uvicorn backend:app --reload
```

5. Open your browser and visit:
```
http://localhost:8000
```

## Project Structure

```
lappu-ai-chatbot/
├── backend.py          # FastAPI backend server
├── index.html         # Main HTML file
├── styles.css        # Custom CSS styles
├── lallu.js         # Frontend JavaScript
└── requirements.txt  # Python dependencies
```

## Contributing

Feel free to open issues and pull requests!

## License

MIT License - feel free to use this project for any purpose.

## Credits

Created by QuickHarsh - @The Harsh Production 