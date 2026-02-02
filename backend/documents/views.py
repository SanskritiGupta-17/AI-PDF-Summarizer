from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from PyPDF2 import PdfReader
import PyPDF2

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import pipeline

from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
from datetime import datetime, timedelta
from decouple import config
import re

# =====================================================
# Helper Functions
# =====================================================

@api_view(['POST'])
def pdf_summary(request):
    pdf_file = validate_pdf(request)
    if not pdf_file:
        return Response(
            {"error": "Invalid PDF"},
            status=status.HTTP_400_BAD_REQUEST
        )
    text = read_pdf(pdf_file)
    summary = summarize_text(text)
    return Response(
        {"summary": summary},
        status=status.HTTP_200_OK
    )

def summarize_text(text):
    spiltters = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200
    )
    chunk = spiltters.split_text(text)

    llm = ChatGroq(
        api_key=config('OPENAI_API_KEY'),
        model="llama-3.3-70b-versatile"
    )

    prompt = PromptTemplate(
        input_variables=["text"],
        template="Summarize the following text clearly: \n {text}"
    )

    chain = prompt | llm | StrOutputParser()
    summaries = [chain.invoke({"text": c}) for c in chunk]

    final_summary = chain.invoke(
        {"text": "".join(summaries)}
    )
    return final_summary

def validate_pdf(request):
    pdf = request.FILES.get('pdf')
    if not pdf or not pdf.name.endswith('.pdf'):
        return None
    return pdf

def read_pdf(file):
    reader = PyPDF2.PdfReader(file)
    raw_text = " ".join([page.extract_text() or "" for page in reader.pages])
    return clean_text(raw_text)

def chunk_text(text):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " ", ""]
    )
    return splitter.split_text(text)

# =====================================================
# Load AI Models (once)
# =====================================================

embedding_model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2",
    device="cpu",
    backend="onnx"
)

# FAISS globals
faiss_index = None
stored_chunks = []

# Summarization models
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

summarizer1 = pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6"
)

# =====================================================
# FAISS globals and threshold
# =====================================================

SIMILARITY_THRESHOLD = 0.3

# =====================================================
# Build FAISS Index
# =====================================================

@api_view(['POST'])
def build_faiss_index(request):
    global faiss_index, stored_chunks

    faiss_index = None
    stored_chunks = []

    pdf_file = validate_pdf(request)
    if not pdf_file:
        return Response(
            {"error": "Please upload a valid PDF file"},
            status=status.HTTP_400_BAD_REQUEST
        )

    text = read_pdf(pdf_file)
    chunks = chunk_text(text)

    cleaned_chunks = [clean_text(chunk) for chunk in chunks]

    embeddings = embedding_model.encode(
        cleaned_chunks,
        normalize_embeddings=True
    )

    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(np.array(embeddings))

    stored_chunks = cleaned_chunks

    return Response(
        {
            "message": "FAISS index created successfully",
            "total_chunks": len(cleaned_chunks),
            "embedding_dimension": dimension
        },
        status=status.HTTP_200_OK
    )

# =====================================================
# Semantic Search
# =====================================================

@api_view(['POST'])
def semantic_search(request):
    query = request.data.get("query")

    if not query:
        return Response({"error": "Query is required"}, status=400)

    if faiss_index is None:
        return Response({"error": "FAISS index not built yet"}, status=400)

    query_embedding = embedding_model.encode(
        [query],
        normalize_embeddings=True
    )

    scores, indices = faiss_index.search(query_embedding, k=3)

    relevant_chunks = []
    for score, idx in zip(scores[0], indices[0]):
        if score >= SIMILARITY_THRESHOLD:
            relevant_chunks.append(stored_chunks[idx])

    if not relevant_chunks:
        return Response(
            {
                "question": query,
                "answer": "The uploaded PDF does not contain an answer to this question.",
                "sources": []
            },
            status=200
        )

    combined_text = " ".join(relevant_chunks)
    final_answer = answer_from_pdf(combined_text, query)

    return Response(
        {
            "question": query,
            "answer": final_answer,
            "sources": relevant_chunks
        },
        status=200
    )

def answer_from_pdf(context, question):
    if not context.strip():
        return "The uploaded PDF does not contain an answer to this question."

    llm = ChatGroq(
        api_key=config('OPENAI_API_KEY'),
        model="llama-3.3-70b-versatile"
    )

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""
        You are an AI assistant.

        Answer the question using ONLY the information from the context below.
        If the answer is NOT present in the context, say:
        "The uploaded PDF does not contain an answer to this question."

        Context:
        {context}

        Question:
        {question}

        Answer:
        """
    )

    chain = prompt | llm | StrOutputParser()
    return chain.invoke({
        "context": context,
        "question": question
    })

def generate_summary(text):
    if not text.strip():
        return ""
    summary = summarizer(
        text,
        max_length=150,
        min_length=50,
        do_sample=False
    )
    return summary[0]["summary_text"]

def generate_summary1(text):
    if not text.strip():
        return ""
    summary = summarizer1(
        text,
        max_length=150,
        min_length=50,
        do_sample=False
    )
    return summary[0]["summary_text"]

# =====================================================
# Existing PDF APIs
# =====================================================

@api_view(['POST'])
def pdf_length(request):
    pdf_file = validate_pdf(request)
    if not pdf_file:
        return Response(
            {"error": "Please upload a valid PDF"},
            status=status.HTTP_400_BAD_REQUEST
        )

    reader = PdfReader(pdf_file)
    return Response(
        {"total_pages": len(reader.pages)},
        status=status.HTTP_200_OK
    )

def clean_text(text):
    text = re.sub(r'-\s*\n\s*', '', text)
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s{2,}', ' ', text)
    text = re.sub(r'\s*\.\s*', '. ', text)
    text = re.sub(r'\s*,\s*', ', ', text)
    text = re.sub(r'\s*:\s*', ': ', text)
    return text.strip()

def format_pdf_date(pdf_date):
    if not pdf_date:
        return ""

    if pdf_date.startswith("D:"):
        pdf_date = pdf_date[2:]

    year = int(pdf_date[0:4])
    month = int(pdf_date[4:6])
    day = int(pdf_date[6:8])
    hour = int(pdf_date[8:10])
    minute = int(pdf_date[10:12])
    second = int(pdf_date[12:14])

    dt = datetime(year, month, day, hour, minute, second)

    tz_match = re.search(r"([+-]\d{2})'?(\d{2})?", pdf_date)
    if tz_match:
        tz_hour = int(tz_match.group(1))
        tz_minute = int(tz_match.group(2) or 0)
        dt -= timedelta(hours=tz_hour, minutes=tz_minute)

    return dt.strftime("%d %b %Y, %I:%M %p")

@api_view(['POST'])
def metadata(request):
    pdf_file = validate_pdf(request)
    if not pdf_file:
        return Response(
            {"error": "Please upload a valid PDF"},
            status=status.HTTP_400_BAD_REQUEST
        )

    reader = PdfReader(pdf_file)
    metadata = reader.metadata or {}
    metadata_dict = dict(metadata)

    metadata_dict["numberOfPages"] = len(reader.pages)
    metadata_dict["CreationDate"] = format_pdf_date(metadata_dict.get("CreationDate"))
    metadata_dict["ModDate"] = format_pdf_date(metadata_dict.get("ModDate"))

    return Response(
        {"metadata": metadata_dict},
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def readdata(request):
    pdf_file = validate_pdf(request)
    if not pdf_file:
        return Response(
            {"error": "Please upload a valid PDF"},
            status=status.HTTP_400_BAD_REQUEST
        )

    text = read_pdf(pdf_file)
    chunks = chunk_text(text)

    return Response(
        {
            "total_characters": len(text),
            "total_words": len(text.split()),
            "total_chunks": len(chunks),
            "sample_chunks": chunks[:3]
        },
        status=status.HTTP_200_OK
    )

@api_view(['POST'])
def method1(request):
    llm = ChatGroq(
        api_key=config('OPENAI_API_KEY'),
        model="llama-3.3-70b-versatile"
    )

    print(llm.invoke("What is API"))
    return Response(status=status.HTTP_200_OK)
