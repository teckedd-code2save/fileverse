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

echo "Installing AWS CLI for AWS..."

uv pip install "awscli-local[ver1]"


echo "Setting up AWS CLI..."
mkdir -p ~/.aws

# Create AWS credentials file
cat > ~/.aws/credentials << EOL
[profile aws-dev]
aws_access_key_id = test
aws_secret_access_key = test
EOL

# Create AWS config file
cat > ~/.aws/config << EOL
[profile aws-dev]
region = eu-west-1
output = json
EOL

echo "Setting up s3 bucket for AWS Localstack..."

awslocal s3 mb s3://file-management

# Setup frontend
echo "Setting up frontend..."
cd ../frontend-new
yarn install

echo "Setup complete! You can now run ./start.sh to start the application." 