
import langchain
import langchain_openai

from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_core.documents import Document


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


def load_json(filename):
    with open(filename, "r") as f:
        data = json.load(f)
    return data 




"""RAG PIPELINE"""



def transcript_pipeline(json_file):
    """Pull the raw transcript from the JSON file"""
    json_doc = load_json(json_file)
    raw_transcript = json_doc["transcript"]

    """Build a new dictionary called "metadata" that extracts the keys from the json file"""
    metadata = {
    "video_id": json_doc["video_id"],
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"]
}

    """Make the raw transcript readable by a human for chunking using LLM"""
    llm = ChatOpenAI(model='gpt-4o')
    response = llm.invoke(f"Edit this document. Make the transcript clean and readable by a human. Remove all line break characters '/n'. Clean all typos.: {raw_transcript}")
    return response.content, metadata



def split_text_add_metadata(clean_transcript, metadata):
    """Split the text and chunk it"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(clean_transcript)

    """Add metadata"""
    documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return documents

