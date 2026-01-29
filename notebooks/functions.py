
import langchain
import langchain_openai

from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_core.documents import Document
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


def write_metadata(video_id, difficulty, title, author, exercise_type, transcript):
    full_url = f"https://www.youtube.com/watch?v={video_id}"
    metadata = {"video_id": video_id, "title": title, "author": author, "difficulty": difficulty, "exercise_type": exercise_type, "transcript": transcript, "full_url": full_url}
    return metadata


def write_json(filename, data):
    """Filename = /Users/your/file/path/name_of_file.json
    data = metadata"""
    with open(filename, "w") as f:
        json.dump(data, f)


def read_json(filename):
    with open(filename, "r") as f:
        data = json.load(f)
    return data 


# Read that dictionary (data) back from the JSON
def clean_and_save_transcript(filepath_in, filepath_out):
# pull the raw_transcript fro the raw_file json dictionary
    # Step 1: Read the dictionary
    data = read_json(filepath_in)
    # Step 2: Get the raw transcript from it
    raw_transcript = data["transcript"]
    # Step 3: Clean it with GPT
    llm = ChatOpenAI(model='gpt-4o')
    # invoke LLM to clean the and edit the raw_transcript, producing cleaned_text
    response = llm.invoke(f"Edit this document {raw_transcript}. Make the transcript clean and readable by a human." 
                        "Remove all line break characters '/n'. Clean all typos. Return ONLY the transcript." 
                        "NO comment from you.")
    # Step 4: Add cleaned text to dictionary
    cleaned_text = response.content # .content turns the response into a string
    data["clean_transcript"] = cleaned_text
    # remove raw transcript from metadata
    data.pop('transcript')
    # save and export
    cleaned_json_file = write_json(filepath_out, data)
    return cleaned_json_file

# example: 
# cleaned_bench_json = clean_and_save_transcript(filepath_in, filepath_out) 
# raw_file = bench_json_raw = read_json("/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/transcripts/nippard_bench_dict.json")
# metadata = bench_metadata = write_metadata(video_id="vcBig73ojpE", difficulty="intermediate", title="How To Get A Huge Bench Press with Perfect Technique", author="Jeff Nippard", exercise_type="bench_press", transcript=transcript)

"""RAG PIPELINE"""



def transcript_pipeline(json_file):
    """Pull the raw transcript from the JSON file"""
    json_doc = read_json(json_file)
    raw_transcript = json_doc["transcript"]

    """Build a new dictionary called "metadata" that extracts the keys from the json file"""
    metadata = {
    "video_id": json_doc["video_id"],
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"],
}

    """Make the raw transcript readable by a human for chunking using LLM"""
    llm = ChatOpenAI(model='gpt-4o')
    response = llm.invoke(f"Edit this document. Make the transcript clean and readable by a human. Remove all line break characters '/n'. Clean all typos. Return ONLY the transcript. NO comment from you.: {raw_transcript}")
    return response.content, metadata



def split_text_add_metadata(clean_transcript, metadata):
    """Split the text and chunk it"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(clean_transcript)

    """Add metadata"""
    documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return documents

