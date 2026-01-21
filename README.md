# Fitness Form Coach

An AI-powered exercise form analysis tool that provides personalized feedback on lifting technique using computer vision and natural language processing.

## Project Overview

This application analyzes video of exercises (bench press, cable row, deadlift) and provides actionable form feedback. Users can ask follow-up questions via voice or text.

### Multimodal Pipeline
- **Video → Frames → Vision Model → Text Feedback**
- **Voice Input → Whisper STT → Text Query → LLM Response**

## Features

- Frame-by-frame exercise analysis using GPT-4o vision
- Voice-based Q&A using OpenAI Whisper
- Tiered feedback (beginner/intermediate/advanced terminology)
- RAG-powered knowledge base from trusted fitness sources

## Repository Structure

```
fitness-form-coach/
├── src/                    # Source code
│   ├── video_processing/   # Frame extraction, video handling
│   ├── speech/             # Whisper integration
│   ├── vision/             # Image analysis pipeline
│   ├── agents/             # LangChain agents (post Week 34)
│   └── knowledge_base/     # Vector DB setup, embeddings
├── data/
│   ├── transcripts/        # YouTube transcripts by channel
│   ├── articles/           # Written resources
│   └── processed/          # Cleaned, tagged, ready to embed
├── notebooks/              # Experimentation and testing
├── prompts/                # Prompt templates
├── deployment/             # Deployment configurations
├── tests/                  # Test suite
├── requirements.txt
└── README.md
```

## Data Sources

### Knowledge Base (by difficulty level)

| Level | Sources |
|-------|---------|
| Beginner | ACE Exercise Library, NASM, NHS Fitness |
| Intermediate | Jeff Nippard, Renaissance Periodization, Stronger by Science |
| Advanced | Starting Strength, Barbell Medicine, PubMed biomechanics |

### Target Exercises
- Bench Press
- Cable Row
- Deadlift

## Setup

```bash
pip install -r requirements.txt
```

## Timeline

- **Pre-project**: Data collection, Whisper testing, vision pipeline validation
- **Days 1-2**: Architecture finalization, LangChain agent setup
- **Days 3-6**: Integration, vector DB, conversational interface
- **Days 7-8**: Testing, evaluation, documentation, deployment
- **Day 9**: Presentation prep
- **Day 10**: Presentation

## Tech Stack

- **Vision**: GPT-4o / Claude vision
- **Speech-to-Text**: OpenAI Whisper
- **Orchestration**: LangChain
- **Vector Database**: TBD (ChromaDB / Pinecone)
- **Testing & Deployment**: LangSmith
- **Framework**: Python

## Authors

Chandler

## License

MIT
