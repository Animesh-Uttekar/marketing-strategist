import os
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = os.getenv("MODEL_NAME", "gpt-oss-120b") 
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN", "") 
DEVICE = os.getenv("DEVICE", "auto") 
MAX_LENGTH = int(os.getenv("MAX_LENGTH", "512")) 

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
