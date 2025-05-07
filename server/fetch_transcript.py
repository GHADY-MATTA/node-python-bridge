import sys
import json

# Main execution block
if __name__ == "__main__":
    # Read JSON input passed from Node.js (via stdin)
    data = sys.stdin.read()

    # Convert JSON string to Python dictionary
    payload = json.loads(data)

    # Extract the YouTube URL and print it
    youtube_url = payload.get("youtube_url")
    print("Received YouTube URL:", youtube_url)
