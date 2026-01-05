import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>© 2026 AI Research Tool | Developed by You</p>
    </footer>
  );
};

const footerStyle = {
  background: "#0b1026",
  color: "#c3cbf7",
  textAlign: "center",
  padding: "15px",
  borderRadius: "20px 20px 0 0",
  marginTop: "30px",
  boxShadow: "0 -6px 18px rgba(124, 77, 255, 0.25)",
};

export default Footer;
