import sys
import json
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import parse_qs, urlparse
sys.stdout.reconfigure(encoding='utf-8')
data = sys.stdin.read()
payload = json.loads(data)
youtube_url = payload.get("youtube_url")
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
title = "Unknown"
channel = "Unknown"
try:
    yt = YouTube(youtube_url)
    title = yt.title or "Unknown"
    channel = yt.author or "Unknown"
except Exception:
    pass
except Exception:
    pass  # Don't crash on metadata failure
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
try:
    with open("transcript.txt", "w", encoding="utf-8") as f:
        for line in transcript:
            f.write(line["text"] + "\n")
except Exception as e:
    print(json.dumps({"error": f"Failed to save transcript: {str(e)}"}, ensure_ascii=False), flush=True)
    sys.exit(1)
output = {
    "video_id": video_id,
    "title": title,
    "channel": channel,
    "language": language,
    "transcript": transcript
}
print(json.dumps(output, ensure_ascii=False), flush=True)
def extract_video_id(url):
    try:
        qs = parse_qs(urlparse(url).query)
        return qs.get("v", [None])[0]
    except Exception as e:
        print(json.dumps({"error": f"Failed to extract video ID: {str(e)}"}, ensure_ascii=False), flush=True)
        sys.exit(1)
