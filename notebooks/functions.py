
import langchain
import langchain_openai

from langchain_openai import ChatOpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from langchain_core.documents import Document
from youtube_transcript_api import YouTubeTranscriptApi
ytt_api = YouTubeTranscriptApi()

import json
import fitz #pymuPDF

import base64



# write a function that takes a video_id and returns the transcript text
def get_transcript(video_id):
    ytt_api = YouTubeTranscriptApi()
    transcript = ytt_api.fetch(video_id) 
    extracted = [script.text for script in transcript]
    joined = " ".join(extracted)
    return joined

"""Get PDF text"""
def get_PDF_text(filepath_in):
    doc = fitz.open(filepath_in)

    pdf_text = ""
    for page in doc:
        pdf_text += page.get_text()

    doc.close()
    return pdf_text

"""Add metadata to documents"""
def write_documnent_metadata(title, author, exercise_type, difficulty, text):
    doc_metadata = {"title": title, "author": author, "exercise_type": exercise_type,  "difficulty": difficulty, "transcript": text}
    return doc_metadata

"""Manually add metadata to each YOUTUBE transcript"""
def write_metadata(video_id, difficulty, title, author, exercise_type, transcript):
    full_url = f"https://www.youtube.com/watch?v={video_id}"
    metadata = {"video_id": video_id, "title": title, "author": author, "difficulty": difficulty, "exercise_type": exercise_type, "transcript": transcript, "full_url": full_url}
    return metadata


def write_json(filepath_out, data):
    """Filepath_out = /Users/your/file/path/name_of_file.json
    data = metadata"""
    with open(filepath_out, "w") as f:
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


"""RAG PIPELINE"""

# create a base64 encoder so taht we can send images to the model API. 
# the model API communicates via JSON. JSON is text. You can't put raw images bytes into JSON.
# So you encode the bytes into a text string which can be decoded by the model.

def base_encoder(filepath_in):
    with open(filepath_in, 'rb') as image_file:
        # read the binary data
        binary_data = image_file.read()

        # encode as base 64
        base64_data = base64.b64encode(binary_data)

        # convert to string 
        base64_string = base64_data.decode('utf-8')

        # print or use base64 string as needed
        return base64_string


def split_text_add_metadata(cleaned_json_dict):
    """Pull the raw transcript from the JSON file"""
    json_doc = read_json(cleaned_json_dict)
    cleaned_transcript = json_doc["clean_transcript"]

    """Build a new dictionary called "metadata" that extracts the keys from the cleaned_json_dict"""
    metadata = {
    "video_id": json_doc["video_id"],
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"],
}
    """Split the text and chunk it"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(cleaned_transcript)

    """Add metadata back onto the cleaned and chunked transcript"""
    chunked_documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return chunked_documents


def split_text_add_TEXT_metadata(cleaned_json_dict):
    """Pull the raw transcript from the JSON file"""
    json_doc = read_json(cleaned_json_dict)
    cleaned_transcript = json_doc["clean_transcript"]

    """Build a new dictionary called "metadata" that extracts the keys from the cleaned_json_dict"""
    metadata = {
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"],
}
    """Split the text and chunk it"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(cleaned_transcript)

    """Add metadata back onto the cleaned and chunked transcript"""
    chunked_documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return chunked_documents


