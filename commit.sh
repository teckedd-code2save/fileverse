#!/bin/bash

# Create .gitignore if it doesn't exist
cat > .gitignore << EOL

# Frontend
# Compiled output
/frontend-new/dist
/frontend-new/tmp
/frontend-new/out-tsc
/frontend-new/bazel-out

# Node
/frontend-new/node_modules
/frontend-new/npm-debug.log
/frontend-new/yarn-error.log


# Miscellaneous
/frontend-new/.angular/cache
/frontend-new/.sass-cache/
/frontend-new/connect.lock
/frontend-new/coverage
/frontend-new/libpeerconnection.log
/frontend-new/testem.log
/frontend-new/typings

# System files
.DS_Store
Thumbs.db

# Backend
/backend/__pycache__/
/backend/.venv/
/backend/build/
/backend/dist/
/backend/wheels/
/backend/*.egg-info/

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

EOL

# Initialize git if not already initialized
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "Initial commit: Monorepo setup with frontend and backend"
    git branch -M main
    git remote add origin https://github.com/teckedd-code2save/fileverse.git
    git push -u origin main
else
    # Regular commit
    git add .
    git commit -m "$1"
    git push origin main
fi