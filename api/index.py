# Vercel entry point for FastAPI backend
from app.main import app

# Export the FastAPI app for Vercel
handler = app
