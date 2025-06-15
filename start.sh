#!/bin/bash

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Start backend
echo "Starting backend server..."
cd backend
# uv venv
source .venv/bin/activate

fastapi run --reload app/main.py &

# Start frontend
echo "Starting frontend server..."
cd ../frontend-new
yarn start &

# Wait for both processes
wait 