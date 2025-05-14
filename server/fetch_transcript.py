import sys
import json
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import parse_qs, urlparse

# Fix output encoding
sys.stdout.reconfigure(encoding='utf-8')

# Step 1: Read JSON input passed from Node.js (via stdin)
data = sys.stdin.read()

# Step 2: Convert to dict and extract URL
payload = json.loads(data)
youtube_url = payload.get("youtube_url")
# print("Received YouTube URL:", youtube_url)

# Step 3: Extract video ID
def extract_video_id(url):
    try:
        qs = parse_qs(urlparse(url).query)
        return qs.get("v", [None])[0]
    except Exception:
        return None

video_id = extract_video_id(youtube_url)

if not video_id:
    print(json.dumps({"error": "Invalid YouTube URL"}, ensure_ascii=False), flush=True)
    sys.exit(1)

# Step 4: Get metadata (optional)
title = "Unknown"
channel = "Unknown"

try:
    yt = YouTube(youtube_url)
    title = yt.title or "Unknown"
    channel = yt.author or "Unknown"
except Exception:
    pass  # Don't crash on metadata failure

# Step 5: Get transcript
try:
    transcript_raw = YouTubeTranscriptApi.get_transcript(video_id)
    transcript = [
        {
            "text": line.get("text", ""),
            "start": line.get("start", 0),
            "duration": line.get("duration", 0)
        }
        for line in transcript_raw
    ]
    language = transcript_raw[0].get("language_code", "en") if transcript_raw else "unknown"
except Exception as e:
    print(json.dumps({"error": f"Transcript not found: {str(e)}"}, ensure_ascii=False), flush=True)
    sys.exit(1)

# Step 6: Save transcript to file
try:
    with open("transcript.txt", "w", encoding="utf-8") as f:
        for line in transcript:
            f.write(line["text"] + "\n")
except Exception as e:
    print(json.dumps({"error": f"Failed to save transcript: {str(e)}"}, ensure_ascii=False), flush=True)
    sys.exit(1)

# Step 7: Print final JSON output
output = {
    "video_id": video_id,
    "title": title,
    "channel": channel,
    "language": language,
    "transcript": transcript
}

print(json.dumps(output, ensure_ascii=False), flush=True)
