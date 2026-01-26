
from youtube_transcript_api import YouTubeTranscriptApi
ytt_api = YouTubeTranscriptApi()

import json


# write a function that takes a video_id and returns the transcript text
def get_transcript(video_id):
    ytt_api = YouTubeTranscriptApi()
    transcript = ytt_api.fetch(video_id) 
    extracted = [script.text for script in transcript]
    joined = " ".join(extracted)
    return joined


def get_metadata(video_id, difficulty, title, author, exercise_type, transcript):
    full_url = f"https://www.youtube.com/watch?v={video_id}"
    metadata = {"video_id": video_id, "title": title, "author": author, "difficulty": difficulty, "exercise_type": exercise_type, "transcript": transcript, "full_url": full_url}
    return metadata


def create_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f)


def load_json(filename, data):
    with open(filename, "r") as f:
        json.dump(data, f)


def load_json(filename):
    with open(filename, "r") as f:
        data = json.load(f)
    return data 