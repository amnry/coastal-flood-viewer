#!/bin/bash

# Development startup script for Coastal Flood Viewer
# This script starts both the backend and frontend servers

echo "🚀 Starting Coastal Flood Viewer Development Servers"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup EXIT INT TERM

# Check if backend exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Are you in the coastal-flood-viewer directory?"
    exit 1
fi

# Check if frontend exists
if [ ! -d "frontend" ]; then
    echo "❌ Frontend directory not found. Are you in the coastal-flood-viewer directory?"
    exit 1
fi

# Start backend
echo -e "${BLUE}📡 Starting Backend Server (Flask)...${NC}"
cd backend

# Check if virtual environment should be activated
if [ -d "../../ams585venv" ]; then
    echo "   Activating ams585venv..."
    source ../../ams585venv/bin/activate
fi

# Install dependencies if needed
if [ ! -f ".deps_installed" ]; then
    echo "   Installing backend dependencies..."
    pip install -r requirements.txt > /dev/null 2>&1
    touch .deps_installed
fi

# Start backend in background on port 5001 (5000 may be occupied by macOS)
PORT=5001 python app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo -e "${GREEN}   ✓ Backend started (PID: $BACKEND_PID)${NC}"
echo "   Logs: backend.log"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${BLUE}🌐 Starting Frontend Server (Next.js)...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "   Installing frontend dependencies..."
    npm install > /dev/null 2>&1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "   Creating .env.local..."
    cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5001
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF
fi

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}   ✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   Logs: frontend.log"
echo ""

# Wait for servers to be ready
echo "⏳ Waiting for servers to be ready..."
sleep 5

echo ""
echo -e "${GREEN}✅ All servers are running!${NC}"
echo ""
echo "📍 Application URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5001"
echo "   Health:    http://localhost:5001/health"
echo ""
echo "📋 Logs:"
echo "   Backend:   tail -f backend.log"
echo "   Frontend:  tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Keep script running and show logs
tail -f frontend.log backend.log

