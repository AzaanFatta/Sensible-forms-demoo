from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS: allow frontend to talk to backend (localhost for now)
origins = [
    "http://localhost:5500",  # if you use a simple static server
    "http://127.0.0.1:5500",
    "http://localhost:8000",  # in case you serve frontend from backend later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for class demo, wide open
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/chat")
async def chat(bot: str = Form(...), message: str = Form(...)):
    """
    Simulate the three bots. No real LLM here, just canned behavior.
    """
    if bot == "question":
        reply = f"[Question Bot] I can help generate survey questions about: {message}"
    elif bot == "form":
        reply = f"[Form Bot] I would deploy a Google Form for the topic: {message}"
    elif bot == "analysis":
        reply = f"[Analysis Bot] I can suggest ways to analyze responses about: {message}"
    else:
        reply = "[System] Unknown bot selected."

    return {"bot": bot, "message": message, "reply": reply}


@app.post("/api/upload")
async def upload_file(
    bot: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Simulate file validation and routing to a subsystem.
    For the prototype we just check if it's a CSV.
    """
    filename = file.filename

    if not filename.lower().endswith(".csv"):
        return {
            "status": "error",
            "reason": "Only CSV files are supported in this prototype.",
            "bot": bot,
            "filename": filename,
        }

    # You *could* read the contents here, but not required for demo:
    # content = await file.read()

    return {
        "status": "ok",
        "message": "File accepted and ready for processing (prototype).",
        "bot": bot,
        "filename": filename,
    }
