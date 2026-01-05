import React, { useState } from "react";
import API from "../api";
import "../App.css";

const UploadArea = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [basicSummary, setBasicSummary] = useState("");
  const [advancedSummaryData, setAdvancedSummaryData] = useState(null);

  // Upload file
  const uploadPDF = async () => {
    if (!file) {
      setMessage("Please select a PDF before uploading ❗");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await API.post("upload/", fd);
      setFileName(res.data.file_path || "");
      setMessage("PDF uploaded successfully 🎉");
      setMetadata(null);
      setBasicSummary("");
      setAdvancedSummaryData(null);
    } catch (err) {
      setMessage("Upload failed ❌");
      console.error(err);
    }
  };

  // Get PDF metadata
  const getMetadata = async () => {
    if (!fileName) return;
    try {
      const res = await API.post("metadata/", { filename: fileName });
      setMetadata(res.data);
    } catch (err) {
      console.error("Metadata error:", err);
      setMessage("Failed to fetch metadata ❌");
    }
  };

  // Get basic extractive summary
  const getBasicSummary = async () => {
    if (!fileName) return;
    try {
      const res = await API.post("summary/basic/", { filename: fileName });
      setBasicSummary(res.data.basic_extractive_summary);
    } catch (err) {
      console.error("Basic summary error:", err);
      setMessage("Failed to fetch basic summary ❌");
    }
  };

  // Get advanced extractive summary
  const getAdvancedSummary = async () => {
    if (!fileName) return;
    try {
      const res = await API.post("summary/advanced/", { filename: fileName });
      setAdvancedSummaryData(res.data);
    } catch (err) {
      console.error("Advanced summary error:", err);
      setMessage("Failed to fetch advanced summary ❌");
    }
  };

  return (
    <div className="container">
      {/* Upload Section */}
      <div
        className="upload-section"
        onClick={() => document.getElementById("pdf-input").click()}
      >
        <input
          id="pdf-input"
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? <p>{file.name}</p> : <p>Click here or select a PDF to upload</p>}
      </div>

      <div className="button-group">
        <button className="action-btn" onClick={uploadPDF}>
          Upload PDF
        </button>
        <button className="action-btn" onClick={getMetadata}>
          📄 Metadata
        </button>
        <button className="action-btn" onClick={getBasicSummary}>
          🧾 Basic Summary
        </button>
        <button className="action-btn" onClick={getAdvancedSummary}>
          🤖 Advanced Summary
        </button>
      </div>

      {/* Output Section */}
      <div className="output-box">
        {message && <p className="message">{message}</p>}

        {metadata && (
          <>
            <h3>📑 PDF Metadata</h3>
            <hr style={{ margin: "10px 0", borderColor: "#7c4dff" }} />
            <div className="metadata-item"><strong>Total Pages:</strong> {metadata.total_pages ?? "N/A"}</div>
            <div className="metadata-item"><strong>Title:</strong> {metadata.title || "N/A"}</div>
            <div className="metadata-item"><strong>Author:</strong> {metadata.author || "N/A"}</div>
            <div className="metadata-item"><strong>Creator:</strong> {metadata.creator || "N/A"}</div>
            <div className="metadata-item"><strong>Producer:</strong> {metadata.producer || "N/A"}</div>
          </>
        )}

        {basicSummary && (
          <>
            <h3>🧾 Basic Summary</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{basicSummary}</pre>
          </>
        )}

        {advancedSummaryData && (
          <>
            <h3>🤖 Advanced Summary</h3>
            <pre style={{ whiteSpace: "pre-wrap" }}>{advancedSummaryData.advanced_extractive_summary}</pre>

            {advancedSummaryData.key_insights?.length > 0 && (
              <>
                <h4>🔑 Key Insights</h4>
                <ul>
                  {advancedSummaryData.key_insights.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </>
            )}

            {advancedSummaryData.important_points?.length > 0 && (
              <>
                <h4>📌 Important Points</h4>
                <ul>
                  {advancedSummaryData.important_points.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </>
            )}

            {advancedSummaryData.keywords?.length > 0 && (
              <>
                <h4>🏷 Keywords</h4>
                <div className="keywords">
                  {advancedSummaryData.keywords.map((kw, i) => (
                    <span key={i} className="keyword-badge">{kw}</span>
                  ))}
                </div>
              </>
            )}

            {advancedSummaryData.conclusion && (
              <>
                <h4>✅ Conclusion</h4>
                <p>{advancedSummaryData.conclusion}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadArea;