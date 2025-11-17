#!/bin/bash

echo "Starting BeProduct OAuth Application..."
echo "========================================"
echo ""
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to catch Ctrl+C
trap cleanup INT TERM

# Start backend in background
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend in background
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait
