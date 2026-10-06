@echo off
echo Starting Password Manager...

echo Starting Backend Server...
start cmd /k "cd Backend && npm run dev"

echo Starting Frontend Server...
start cmd /k "cd Frontend && npm run dev"

echo Both servers are starting in separate windows!
