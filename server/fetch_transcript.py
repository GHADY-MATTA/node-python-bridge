import sys
import json
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import parse_qs, urlparse
sys.stdout.reconfigure(encoding='utf-8')
data = sys.stdin.read()
