import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Branding */}
                <h2 className="footer-title">AI Research Paper Analyzer</h2>
                <p className="footer-tagline">Research Simplified. Insights Amplified.</p>

                <div className="footer-sections">

                    {/* Optional Built With */}
                    <div className="footer-column">
                        <h4>Built With</h4>
                        <ul>
                            <li>React</li>
                            <li>Django REST API</li>
                            <li>LangChain</li>
                            <li>Hugging Face</li>
                            <li>Groq API</li>
                            <li>FAISS</li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-column">
                        <h4>Contact</h4>
                        <ul>
                            <li>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></li>
                            <li>LinkedIn: <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourlinkedin</a></li>
                            <li>GitHub: <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer">github.com/yourgithub</a></li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom */}
                <p className="footer-bottom">
                    © 2026 AI Research Paper Analyzer — Developed by Sanskriti Gupta
                </p>
            </div>
        </footer>
    );
};

export default Footer;