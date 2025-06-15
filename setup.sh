#!/bin/bash

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Create and activate virtual environment
echo "Setting up Python virtual environment..."
cd backend
uv venv
source .venv/bin/activate

# Install dependencies from pyproject.toml file
echo "Installing Python dependencies..."
uv pip install -e .

# Setup frontend
echo "Setting up frontend..."
cd ../frontend-new
yarn install

echo "Setup complete! You can now run ./start.sh to start the application." 