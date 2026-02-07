# Fitness Form Coach

A RAG-powered Q&A system that answers exercise form questions using a curated knowledge base of expert fitness sources.

## What It Does

Ask a question about exercise technique — like "what muscles should I engage when I bench press?" — and get an accurate, grounded response based on real expert guidance, not generic LLM knowledge.

The system retrieves relevant chunks from a curated knowledge base of fitness experts (Jeff Nippard, Mark Rippetoe, Layne Norton) and uses them as context for the LLM response. This means answers are traceable to real sources and less prone to hallucination.

## How It Works

1. **Ingest**: YouTube transcripts are pulled, cleaned with GPT-4, and tagged with metadata (author, difficulty level, exercise type)
2. **Chunk**: Transcripts are split into ~1000 character chunks with overlap to preserve context
3. **Embed & Store**: Chunks are embedded using OpenAI's `text-embedding-3-small` and stored in ChromaDB
4. **Retrieve**: User questions trigger a similarity search to find the most relevant chunks
5. **Generate**: Retrieved context + user question are passed to GPT-4 with a system prompt that enforces grounding

## Tech Stack

- **Python**
- **LangChain** — document loading, text splitting, prompt templates, chains
- **ChromaDB** — vector storage and similarity search
- **OpenAI API** — embeddings (`text-embedding-3-small`) and chat completions (`gpt-4o`)

## Key Design Decisions

- **Precision over recall**: For fitness advice, wrong information can cause injury. The system is designed to say "I don't have that information yet" rather than guess.
- **Metadata tagging**: Each chunk carries author, difficulty level, and exercise type — enabling future filtering by user experience level.
- **Grounded responses**: The system prompt explicitly constrains the LLM to only use retrieved context, reducing hallucination risk.

## Project Structure

```
fitness-form-coach/
├── chroma_db/
├── data/
│   ├── processed/
│   └── transcripts/
├── notebooks/
│   ├── functions.py
│   ├── rag_pipeline.ipynb
│   ├── text_transcripts.ipynb
│   ├── youtube_transcripts.ipynb
│   └── video_to_image_extraction.ipynb
├── prompts/
│   └── vision_model_prompts.md
├── .gitignore
├── README.md
└── requirements.txt
```

## What's Next

- [ ] Voice-to-text input using OpenAI Whisper
- [ ] Image-to-text for exercise form analysis
- [ ] Evaluation framework to measure retrieval accuracy and response quality
- [ ] Streamlit frontend for demo

## Author

Chandler Shortlidge  
[LinkedIn](https://linkedin.com/in/chandlershortlidge) | [GitHub](https://github.com/chandlershortlidge)
