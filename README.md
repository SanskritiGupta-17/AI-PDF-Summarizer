# AI Research Paper Analyzer 📄🤖

A full-stack web application that allows users to upload research papers (PDF), automatically extract metadata, generate AI-powered summaries, and perform semantic search for insights. Designed to simplify research and make understanding papers fast and easy.

---

## 🔧 Tech Stack

### Backend
- **Framework:** Django, Django REST Framework  
- **PDF Processing:** PyPDF2  
- **NLP / AI:** Sentence Transformers, scikit-learn  

### Frontend
- **Framework:** React  
- **HTTP Requests:** Axios  
- **Styling:** CSS  

---

## 🚀 Features

- **PDF Upload:** Upload research papers in PDF format.  
- **Metadata Extraction:** Extract title, authors, abstract, and other metadata automatically.  
- **AI Summaries:** Generate both basic and advanced summaries of research papers.  
- **Semantic Search:** Search within papers using semantic search powered by embeddings.  
- **PDF Manipulation:** Split, merge, and manage PDFs efficiently.  

---

## 📁 Project Structure

AI-Research-Paper-Analyzer/
│
├── backend/ # Django backend
│ ├── manage.py
│ ├── requirements.txt
│ └── ...
│
├── frontend/ # React frontend
│ ├── package.json
│ ├── src/
│ └── ...
│
└── README.md


---

## ▶️ How to Run

### Backend
1. Navigate to the backend directory:
```bash
cd backend
Install dependencies:

pip install -r requirements.txt
Run the server:

python manage.py runserver
The backend will start at http://127.0.0.1:8000/.

Frontend
Navigate to the frontend directory:

cd frontend
Install dependencies:

npm install
Start the React development server:

npm start
The frontend will open at http://localhost:3000/.

🛠 Usage
Open the app in your browser.

Upload a research paper (PDF).

View extracted metadata automatically.

Generate AI summaries for quick understanding.

Use semantic search to find relevant content across papers.

💡 Future Improvements
User authentication and profiles.

Save uploaded papers and summaries for later.

Integrate more advanced NLP models for better summarization.

Add collaborative features for team research.
