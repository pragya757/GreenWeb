#!/usr/bin/env bash
# ==============================================================================
# GreenWeb – Start Both Backend and Frontend
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "🌿 Starting GreenWeb Services..."

# 1. Start Backend
echo "🚀 Starting Flask Backend on http://localhost:5001..."
cd "$DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

python run.py &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"

# 2. Start Frontend
echo "⚛️ Starting Vite Frontend on http://localhost:5173..."
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "Frontend running (PID: $FRONTEND_PID)"

echo ""
echo "=========================================================="
echo "🌱 GreenWeb is live!"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend API: http://localhost:5001/api/health"
echo "   Press Ctrl+C to stop both servers."
echo "=========================================================="

trap "echo 'Shutting down services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

wait
