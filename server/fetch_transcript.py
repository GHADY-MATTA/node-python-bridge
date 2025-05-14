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
