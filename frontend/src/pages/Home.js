import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll when coming from other page with hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });

          // REMOVE HASH AFTER SCROLL
          window.history.replaceState(null, null, " ");
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      <Header />

      <section id="hero" className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>AI Powered Research Paper Summarizer & Insights Extractor</h1>
          <p>Skip the hassle of reading lengthy research papers. Let the AI handle it so that you can discover extra.
            <br />
            Upload your PDF and let AI instantly transform complex research into clear summaries, highlight key information, extract essential metadata, and uncover meaningful insights through semantic search - so you can discover what matters without scrolling through hundreds of pages.
          </p>
          <button onClick={() => navigate("/upload")}>Get Started</button>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="about-title">About The Project</h2>
          <p className="about-text">
            Our platform transforms the way you interact with research papers. Simply upload your PDF, and let our AI-powered system analyze it to extract essential metadata, generate concise summaries, and make complex research easily understandable. Using advanced semantic search, you can instantly search for keywords or phrases within the paper or the generated summary, receiving precise, context-aware insights about your query. No more scrolling through hundreds of pages—discover what matters in seconds.
          </p>
          <p className="about-text">
            The AI backend leverages cutting-edge models and APIs, including Groq API for summarization, Hugging Face Transformers like BART for natural language processing, and Sentence-BERT for generating semantic embeddings. LangChain orchestrates document processing, text splitting, and prompt management to efficiently generate summaries and support semantic search capabilities. We enhance search with vector databases like FAISS.
          </p>
          <p className="about-text">
            The full-stack solution is powered by Django REST API for robust backend services and React for a dynamic, responsive user interface. For PDF parsing and efficient data handling, the system relies on PyPDF2 and Numpy to accurately extract, process, and structure research content.
          </p>
          <div className="tech-stack">Tech Stack</div>
          <p className="tech-items">
            Python | Django REST API | React | PyPDF2 | NumPy | Hugging Face | LangChain | FAISS | Groq API
          </p>
        </div>
      </section>

      <section id="how-it-works" className="how-section">
        <div className="how-container">

          <div className="how-header">
            <h2>How It Works</h2>
            <p>
              Analyze research papers in seconds with our simple 4 steps AI-powered workflow.
            </p>
          </div>

          <div className="how-steps">

            <div className="how-card">
              <div className="icon-box">
                <span className="step">01</span>
                <i className="fa-solid fa-file-arrow-up"></i>
              </div>
              <h3>Upload PDF</h3>
              <p>
                Upload your research paper in PDF format. The system securely reads
                and prepares the document for analysis.
              </p>
            </div>

            <div className="how-card">
              <div className="icon-box">
                <span className="step">02</span>
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3>AI Analysis</h3>
              <p>
                Our AI extracts metadata, splits the document, and understands
                the content using advanced language models.
              </p>
            </div>

            <div className="how-card">
              <div className="icon-box">
                <span className="step">03</span>
                <i className="fa-solid fa-lightbulb"></i>
              </div>
              <h3>Summaries & Insights</h3>
              <p>
                Instantly receive structured summaries, key findings, and
                methodologies without reading the full paper.
              </p>
            </div>

            <div className="how-card">
              <div className="icon-box">
                <span className="step">04</span>
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3>Semantic Search</h3>
              <p>
                Search any term or concept and get context-aware results from
                both the paper and generated summary.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="features" className="section">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Key Features</h2>
          <p className="text-slate-500 mt-3">
            Advanced AI capabilities built for efficient document analysis and semantic understanding.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>PDF Analysis</h3>
            <p>
              Upload any research paper in PDF format and let the system automatically read, process, and analyze the document. The platform extracts text, identifies important sections, and prepares the content for AI-driven understanding without any manual effort.
            </p>
          </div>
          <div className="feature-card">
            <h3>Summary Generation</h3>
            <p>
              The AI model generates clear, structured summaries of lengthy research papers within seconds. Users can quickly grasp the core ideas, objectives, and conclusions without reading the entire document, saving significant time and effort.
            </p>
          </div>
          <div className="feature-card">
            <h3>Insight Extraction</h3>
            <p>
              Beyond summaries, the system highlights key findings, methodologies, and important concepts from the research. This helps users understand the practical value and technical depth of the paper at a glance.
            </p>
          </div>
          <div className="feature-card">
            <h3>Semantic Search</h3>
            <p>
              Advanced semantic search allows users to find relevant words, phrases, or topics within both the original paper and the generated summary. Instead of simple keyword matching, the system understands context and returns meaningful, accurate results instantly.
            </p>
          </div>
        </div>
      </section>

      <footer id="contact">
        {/* Footer */}
      </footer>

      <Footer />
    </>
  );
}

export default Home;