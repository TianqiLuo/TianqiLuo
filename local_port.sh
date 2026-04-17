# Start the server
python3 -m http.server 8000

# Kill the server
lsof -ti :8000 | xargs kill -9