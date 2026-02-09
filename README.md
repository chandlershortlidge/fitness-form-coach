# Fitness Form Coach

A RAG-powered AI coaching system that analyzes workout videos and provides personalized exercise form feedback grounded in expert fitness knowledge.

## What It Does

Upload a video of your workout and get detailed, expert-backed form feedback. The system extracts frames from your video, classifies the exercise, retrieves relevant coaching knowledge, and uses multi-frame analysis to identify form issues across your full range of motion.

Responses are grounded in a curated knowledge base of fitness experts (Jeff Nippard, Mark Rippetoe, Layne Norton) — not generic LLM output. This means feedback is traceable to real sources and less prone to hallucination.

## How It Works

1. **Extract**: Workout video frames are extracted at regular intervals using OpenCV
2. **Classify**: A GPT-4o classifier identifies the exercise and key body checkpoints from a single frame
3. **Retrieve**: Classification tags drive a similarity search against the vector database to find the most relevant expert coaching chunks
4. **Analyze**: All extracted frames + retrieved context are passed to GPT-5, which performs multi-frame analysis to detect movement patterns and form issues across the full set of images
5. **Ground**: A system prompt constrains the response model to only use retrieved expert context, reducing hallucination risk

The system will soon support text-based Q&A — ask a question about exercise technique and get an accurate, grounded response based on real expert guidance.

## Tech Stack

- **Python**
- **OpenAI API** — GPT-5 (multi-frame form analysis), GPT-4o (image classification), `text-embedding-3-small` (embeddings)
- **LangChain** — document loading, text splitting, prompt templates, chains
- **ChromaDB** — vector storage and similarity search
- **OpenCV** — video frame extraction

## Key Design Decisions

- **Multi-frame analysis**: Rather than analyzing a single snapshot, the system passes multiple frames to GPT-5 so it can detect patterns across the movement (e.g., bar path, elbow flare throughout the rep).
- **Classifier-driven retrieval**: A separate classification model tags each image with exercise type and body checkpoints, which are then used as the similarity search query. This produces more relevant context than raw image descriptions.
- **Precision over recall**: For fitness advice, wrong information can cause injury. The system is designed to say "I don't have that information yet" rather than guess.
- **Grounded responses**: The system prompt explicitly constrains the LLM to only use retrieved context, reducing hallucination risk.
- **Metadata tagging**: Each chunk carries author, difficulty level, and exercise type — enabling future filtering by user experience level.

## Project Structure

```
fitness-form-coach/
├── chroma_db/                        # Persisted ChromaDB vector store
├── data/
│   ├── articles/                     # Additional reference materials
│   ├── processed/
│   │   ├── processed-images/         # Extracted video frames (JPG)
│   │   └── cleaned_*.json            # Cleaned transcript chunks
│   ├── raw_workout_videos/           # Source workout videos
│   └── transcripts/                  # Raw transcript JSON files
├── notebooks/
│   ├── functions.py                  # Core utility functions
│   ├── rag_pipeline.ipynb            # RAG pipeline + multi-frame analysis
│   ├── video_to_image_extraction.ipynb  # Video frame extraction
│   ├── text_transcripts.ipynb        # Text transcript processing
│   └── youtube_transcripts.ipynb     # YouTube transcript extraction
├── prompts/
│   └── vision_model_prompts.md       # Vision model prompt development
├── .gitignore
├── README.md
└── requirements.txt
```

## What's Next

- Text-based Q&A for exercise technique questions
- Voice-to-text input (Whisper API)
- Evaluation framework
- Streamlit frontend
- More exercise types

## Author

Chandler Shortlidge
[LinkedIn](https://linkedin.com/in/chandlershortlidge) | [GitHub](https://github.com/chandlershortlidge)
