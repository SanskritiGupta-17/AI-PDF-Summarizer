import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const goToSection = (id) => {
    navigate(`/#${id}`);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="navbar">
      <div className="logo">Research Simplified. Insights Amplified.</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li onClick={() => goToSection("about")}><span>About</span></li>
        <li onClick={() => goToSection("how-it-works")}><span>How it Works</span></li>
        <li onClick={() => goToSection("features")}><span>Features</span></li>
        <li onClick={() => goToSection("contact")}><span>Contact</span></li>
      </ul>
    </nav>
  );
}

export default Header;