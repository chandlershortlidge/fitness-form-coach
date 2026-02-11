
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
import os 
import cv2

"""VIDEO PROCESSING PIPELINE"""

def create_video_name(filepath_in):
    basename = os.path.basename(filepath_in) # takes path and returns basename (video_name.mp4)
    split_text = basename.split(".") # splits basename into list
    video_name = split_text[0] # returns first item on that list
    print("Video name:", video_name)
    return video_name

def save_video_frames(filepath_in, frames):
    video_name = create_video_name(filepath_in)
    for i, frame in enumerate(frames):
        cv2.imwrite(f"/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/data/processed/processed-images/{video_name}_{i}.jpg", frame)
    print(f"Saved to processed-images/{video_name}")


# if your video is 30fps and you want a frame every 2 seconds, that's every 60 frames (2 × 30).
# interval_seconds = max_seconds / extracted_frame_count
# Interval_frames = interval_seconds * native_fps

def extract_video_frames(frame_count, max_seconds, filepath_in):
    frames = []
    current_frame = 0
    cap = cv2.VideoCapture(filepath_in) # opens the video like open('file.txt'). cap is now the video object 
    native_fps = cap.get(cv2.CAP_PROP_FPS) # cap prop fps gets the native frame rate of the recording 
    interval_seconds = max_seconds / frame_count 
    # ex: 0.66 interval secionds = 10 max seconds / 15 desired frames
    frame_interval = interval_seconds * native_fps 
    # 20  = 0.66 * 30 native fps 
    max_frames = int(native_fps * max_seconds)
    # calculate the max frames in a video. eg: 30fps * 10 seconds = 300 max frames
    while current_frame < max_frames:
        success, frame = cap.read()
        if not success:
            break
        if current_frame % frame_interval == 0:
            frames.append(frame)
        
        current_frame += 1
    cap.release() # closes the tile
    
    print(f"Frames processed: {frame_count}, ({max_seconds}s cap)")
    
    return frames
    
"""TEXT PROCESSING PIPELINE"""

# write a function that takes a video_id and returns the transcript text
def get_transcript(video_id):
    """Fetch and join the transcript for a YouTube video.

    Args:
        video_id: YouTube video identifier (the part after `v=` in the URL).

    Returns:
        A single string containing the full transcript text in timeline order.
    """
    ytt_api = YouTubeTranscriptApi()
    transcript = ytt_api.fetch(video_id) 
    extracted = [script.text for script in transcript]
    joined = " ".join(extracted)
    return joined

def get_PDF_text(filepath_in):
    """Extract all text from a PDF file.

    Args:
        filepath_in: Path to the PDF file on disk.

    Returns:
        Concatenated text from every page in the document.
    """
    doc = fitz.open(filepath_in)

    pdf_text = ""
    for page in doc:
        pdf_text += page.get_text()

    doc.close()
    return pdf_text

def write_documnent_metadata(title, author, exercise_type, difficulty, text):
    """Build a metadata dictionary for a transcript document.

    Args:
        title: Title of the content.
        author: Creator or channel name.
        exercise_type: Activity category (e.g., yoga, HIIT).
        difficulty: Difficulty label.
        text: Raw transcript text to attach.

    Returns:
        Dictionary containing the provided metadata fields.
    """
    doc_metadata = {"title": title, "author": author, "exercise_type": exercise_type,  "difficulty": difficulty, "transcript": text}
    return doc_metadata

def write_metadata(video_id, difficulty, title, author, exercise_type, transcript):
    """Create metadata for a YouTube transcript with a constructed URL.

    Args:
        video_id: YouTube video identifier.
        difficulty: Difficulty label for the workout.
        title: Video title.
        author: Channel or creator name.
        exercise_type: Activity category.
        transcript: Raw transcript text.

    Returns:
        Dictionary containing metadata and the full YouTube URL.
    """
    full_url = f"https://www.youtube.com/watch?v={video_id}"
    metadata = {"video_id": video_id, "title": title, "author": author, "difficulty": difficulty, "exercise_type": exercise_type, "transcript": transcript, "full_url": full_url}
    return metadata


def write_json(filepath_out, data):
    """Write a Python object to disk as JSON.

    Args:
        filepath_out: Destination file path, including `.json`.
        data: JSON-serializable object to persist.
    """
    with open(filepath_out, "w") as f:
        json.dump(data, f)


def read_json(filename):
    """Load JSON data from a file path.

    Args:
        filename: Path to a JSON file on disk.

    Returns:
        Parsed Python object (commonly a dict).
    """
    with open(filename, "r") as f:
        data = json.load(f)
    return data 


# Read that dictionary (data) back from the JSON
def clean_and_save_transcript(filepath_in, filepath_out):
    """Clean a transcript with an LLM and save updated metadata.

    Args:
        filepath_in: Path to the JSON file containing a `transcript` field.
        filepath_out: Destination path for the cleaned JSON metadata.

    Returns:
        None. Writes the cleaned metadata file to `filepath_out`.
    """
    # pull the raw transcript from the raw JSON dictionary
    # Step 1: Read the dictionary
    data = read_json(filepath_in)
    # Step 2: Get the raw transcript from it
    raw_transcript = data["transcript"]
    # Step 3: Clean it with GPT
    llm = ChatOpenAI(model='gpt-5')
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
    """Encode a local file's bytes as a Base64 string.

    Args:
        filepath_in: Path to the file to encode (commonly an image).

    Returns:
        Base64-encoded string representation of the file contents.
    """
    with open(filepath_in, 'rb') as image_file:
        # read the binary data
        binary_data = image_file.read()

        # encode as base 64
        base64_data = base64.b64encode(binary_data)

        # convert to string 
        base64_string = base64_data.decode('utf-8')

        # print or use base64 string as needed
        return base64_string


import re
def clean_classification_text(r):
    """Strip non-letter characters from an LLM response.

    Args:
        r: LLM response object with a `.content` string attribute.

    Returns:
        String containing only alphabetical characters and spaces.
    """
    create_string = r.content
    response_cleaned = re.sub(r'[^a-zA-Z]', ' ', create_string)
    return response_cleaned

def split_text_add_metadata(cleaned_json_dict):
    """Chunk cleaned transcript text and attach source metadata.

    Args:
        cleaned_json_dict: Path to a JSON file containing `clean_transcript`
            plus source metadata fields.

    Returns:
        List of LangChain `Document` objects with chunked text and metadata.
    """
    json_doc = read_json(cleaned_json_dict)
    cleaned_transcript = json_doc["clean_transcript"]

    metadata = {
    "video_id": json_doc["video_id"],
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"],
}
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(cleaned_transcript)

    chunked_documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return chunked_documents


def split_text_add_TEXT_metadata(cleaned_json_dict):
    """Chunk cleaned transcript text and attach minimal metadata.

    Args:
        cleaned_json_dict: Path to a JSON file containing `clean_transcript`
            plus text-level metadata fields.

    Returns:
        List of LangChain `Document` objects with chunked text and metadata.
    """
    json_doc = read_json(cleaned_json_dict)
    cleaned_transcript = json_doc["clean_transcript"]

    metadata = {
    "title": json_doc["title"],
    "author": json_doc["author"],
    "difficulty": json_doc["difficulty"],
    "exercise_type": json_doc["exercise_type"],
}
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(cleaned_transcript)

    chunked_documents = [Document(page_content=chunk, metadata=metadata) for chunk in chunks]

    return chunked_documents
