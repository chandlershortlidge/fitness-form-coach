"""
RAG Tester API
FastAPI backend that exposes your fitness coach RAG chain with full source document visibility.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time
import os
from dotenv import load_dotenv

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

app = FastAPI(title="RAG Tester API")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load persisted vectorstore
embeddings = OpenAIEmbeddings(model='text-embedding-3-small')
vectorstore = Chroma(
    persist_directory="/Users/chandlershortlidge/Desktop/Ironhack/fitness-form-coach/chroma_db",
    embedding_function=embeddings
)

# LLM setup
llm = ChatOpenAI(model="gpt-4o")
output_parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", """You understand common form mistakes and why they happen. You prioritize helping users fix their form, but you understand that users also have other goals, like losing weight or building muscle. 
     Therefore, once you offer form feedback, offer tips on the specific exercise in question related to the question asked, but ONLY if the answer is found in your context."
    If the context doesn't contain the answer but is related to exercise or working out (like nutrition, diet, etc.), apologize, and say, 'I don't have that information in my knowledge base yet, but we will soon!' and stop. 
    Do not provide information from your general knowledge. If the question is unrelated to exercise, politely tell the user you can't answer questions unrelated to exercise.
    Be conversational, but use bullet points when appropriate (eg, when listing steps to fix form).
    You give actionable feedback like 'squeeze your shoulder blades' instead of 'fix your back'. You explain your advice some matters (injury risk, strength loss, etc.). 
    You are enthusiastic and excited to help users on their fitness journey.

Context:
{context}"""),
    ("human", "{question}")
])

chain = prompt | llm | output_parser


class QueryRequest(BaseModel):
    question: str
    k: int = 3  # number of documents to retrieve
    exercise_filter: Optional[str] = None  # optional: "bench_press", "squat", "overhead_press"


class SourceDocument(BaseModel):
    content: str
    exercise_type: str
    title: str
    author: str
    video_id: str
    score: Optional[float] = None


class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: list[SourceDocument]
    retrieval_time_ms: float
    generation_time_ms: float
    total_time_ms: float


@app.get("/health")
def health_check():
    return {"status": "ok", "vectorstore_docs": vectorstore._collection.count()}


@app.post("/query", response_model=QueryResponse)
def query_rag(request: QueryRequest):
    start_time = time.time()

    # Build filter if specified
    search_kwargs = {"k": request.k}
    if request.exercise_filter:
        search_kwargs["filter"] = {"exercise_type": request.exercise_filter}

    # Retrieve documents with scores
    retrieval_start = time.time()
    results_with_scores = vectorstore.similarity_search_with_score(
        request.question,
        **search_kwargs
    )
    retrieval_time = (time.time() - retrieval_start) * 1000

    # Format sources for response
    sources = []
    context_parts = []
    for doc, score in results_with_scores:
        sources.append(SourceDocument(
            content=doc.page_content,
            exercise_type=doc.metadata.get("exercise_type", "unknown"),
            title=doc.metadata.get("title", "unknown"),
            author=doc.metadata.get("author", "unknown"),
            video_id=doc.metadata.get("video_id", "unknown"),
            score=round(score, 4)
        ))
        context_parts.append(doc.page_content)

    # Build context from all retrieved docs
    context = "\n\n---\n\n".join(context_parts)

    # Generate answer
    generation_start = time.time()
    answer = chain.invoke({
        "context": context,
        "question": request.question
    })
    generation_time = (time.time() - generation_start) * 1000

    total_time = (time.time() - start_time) * 1000

    return QueryResponse(
        question=request.question,
        answer=answer,
        sources=sources,
        retrieval_time_ms=round(retrieval_time, 1),
        generation_time_ms=round(generation_time, 1),
        total_time_ms=round(total_time, 1)
    )


@app.get("/exercises")
def list_exercises():
    """List available exercise types for filtering"""
    return {
        "exercises": ["bench_press", "squat", "overhead_press"],
        "description": "Use these values in the exercise_filter parameter"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
