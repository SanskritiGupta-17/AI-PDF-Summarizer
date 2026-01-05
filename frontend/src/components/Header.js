import React from "react";

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>AI-Powered Research Paper Tool</h1>
    </header>
  );
};

const headerStyle = {
  background: "linear-gradient(135deg, #7c4dff, #5e35b1)",
  color: "white",
  padding: "20px",
  textAlign: "center",
  borderRadius: "0 0 20px 20px",
  boxShadow: "0 6px 18px rgba(124, 77, 255, 0.45)",
  marginBottom: "30px",
};

export default Header;
