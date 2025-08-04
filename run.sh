
PID=$(lsof -ti tcp:8000)
if [ -n "$PID" ]; then
  echo "🔪 Killing process on port 8000: $PID"
  kill -9 $PID
fi

source venv/bin/activate

uvicorn app.main:app --reload
