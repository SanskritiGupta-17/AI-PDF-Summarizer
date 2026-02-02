import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Upload.css";
import API from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [metadataResult, setMetadataResult] = useState("");
  const [summary, setSummary] = useState("");
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [metadataSuccess, setMetadataSuccess] = useState(false);
  const [summarySuccess, setSummarySuccess] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [faissBuilt, setFaissBuilt] = useState(false);
  const [uploading, setUploading] = useState(false);

  // -------- FILE CHANGE --------
  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setMessage("Please select only PDF files.");
      setFile(null);
      return;
    }

    setFile(selected);
    setMessage("");
  };

  // -------- UPLOAD --------
  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a PDF file first.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // 1️⃣ Existing logic (unchanged)
      await API.post("read-data/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 2️⃣ NEW: build FAISS index
      await API.post("faiss/build/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 3️⃣ Success message (same intent)
      setMessage("File uploaded and indexed successfully!");
    } catch (err) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false); // 🔴 THIS was missing / not reached
    }
  };

  //-----------------------Formatting---------------------
  const formatPDFDate = (pdfDate) => {
    if (!pdfDate) return "";

    let dateStr = pdfDate.startsWith("D:") ? pdfDate.substring(2) : pdfDate;

    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(8, 10));
    const minute = parseInt(dateStr.substring(10, 12));
    const second = parseInt(dateStr.substring(12, 14));

    const dateObj = new Date(year, month, day, hour, minute, second);
    return dateObj.toLocaleString(); // e.g., "10/4/2023, 10:53:49 AM"
  };

  //-------------------CLEANING METADATA---------
  const displayMetadata = Object.entries(metadataResult || {}).reduce((acc, [key, value]) => {
    const cleanKey = key.replace("/", ""); // remove leading slash

    // Skip numberOfPages and totalWords since they are separate
    if (cleanKey === "numberOfPages" || cleanKey === "totalWords") return acc;

    // If key is already added, skip duplicate
    if (acc[cleanKey]) return acc;

    // Format dates
    if (cleanKey === "CreationDate" || cleanKey === "ModDate") {
      value = formatPDFDate(value);
    }

    acc[cleanKey] = value;
    return acc;
  }, {});

  // -------- METADATA --------
  const generateMetadata = async () => {
    if (!file) {
      setMetadataResult(null);
      setMetadataSuccess(false);
      return;
    }

    setMetadataLoading(true);
    setMetadataResult("Generating metadata...");
    setMetadataSuccess(false); // reset

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await API.post("metadata/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMetadataResult(res.data.metadata || "No metadata found");
      setMetadataSuccess(true); // success message will show
    } catch {
      setMetadataResult("Failed to generate metadata");
      setMetadataSuccess(false);
    } finally {
      setMetadataLoading(false);
    }
  };

  // -------- SUMMARY --------
  const generateSummary = async () => {
    if (!file) {
      setSummary("Please upload a PDF first.");
      setSummarySuccess(false);
      return;
    }

    setSummaryLoading(true);
    setSummary("Generating summary...");
    setSummarySuccess(false); // reset

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await API.post("pdf_summary/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary || "No summary available");
      setSummarySuccess(true); // success message will show
    } catch {
      setSummary("Failed to generate summary");
      setSummarySuccess(false);
    } finally {
      setSummaryLoading(false);
    }
  };

  //------------------------Build faiss index----------
  const buildFaissIndex = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await API.post("faiss/build/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("FAISS index built:", res.data);
      setFaissBuilt(true); // enable the search button
    } catch (err) {
      console.error(err.response?.data || err);
      setFaissBuilt(false);
    }
  };

  // -------- SEARCH --------
  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearchLoading(true);
    setSearchSuccess(false);
    setSearchResult(null);

    try {
      const res = await API.post("faiss/search/", { query: query.trim() });
      setSearchResult(res.data); // Keep JSON object
      setSearchSuccess(true);
    } catch (err) {
      console.error(err.response?.data || err);
      setSearchResult({ error: "Search failed" });
      setSearchSuccess(false);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="upload-page">
        <h2 className="center">Upload Research Paper</h2>
        <p className="center">
          This page will contain Metadata Extraction, Summary Generation,
          Insight Extraction and Chat.
        </p>

        {/* UPLOAD BOX */}
        <div className="upload-box">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {message && <p className="msg">{message}</p>}
      </div>

      {/* -------- METADATA -------- */}
      <div className="section">
        <h3>Metadata</h3>

        {/* Show selected PDF */}
        {file && (
          <p style={{ fontStyle: "italic", marginTop: "5px" }}>
            Selected PDF: {file.name}
          </p>
        )}

        {file && (
          <div className="file-row-container">
            <div className="file-row">
              <button onClick={generateMetadata}>Generate Metadata</button>
            </div>

            {metadataSuccess && (
              <p style={{ color: "green", marginTop: "5px" }}>
                Generated metadata successfully
              </p>
            )}
          </div>
        )}

        {/* RESULT CONTAINER */}
        <div className="result-box">
          {metadataLoading && <p>Generating metadata...</p>}

          {!metadataLoading && metadataResult && typeof metadataResult === "object" && (
            <div className="meta-grid">
              {metadataResult.numberOfPages && (
                <div className="meta-card">
                  <p className="meta-label">Total Pages</p>
                  <p className="meta-value">{metadataResult.numberOfPages}</p>
                </div>
              )}

              {metadataResult.totalWords && (
                <div className="meta-card">
                  <p className="meta-label">Total Words</p>
                  <p className="meta-value">{metadataResult.totalWords}</p>
                </div>
              )}

              {Object.entries(displayMetadata).map(([key, value]) => {
                const labelMap = {
                  Author: "Author",
                  Creator: "Creator",
                  CreationDate: "Created On",
                  ModDate: "Last Modified",
                  Producer: "Producer",
                };

                return (
                  <div key={key} className="meta-card">
                    <p className="meta-label">{labelMap[key] || key}</p>
                    <p className="meta-value">{value}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* If metadataResult is empty or not an object */}
          {!metadataLoading && (!metadataResult || Object.keys(metadataResult).length === 0) && (
            <p>No metadata available.</p>
          )}

          {/* Show raw message if metadataResult is a string */}
          {!metadataLoading && metadataResult && typeof metadataResult !== "object" && (
            <p>{metadataResult}</p>
          )}
        </div>
      </div>

      {/* -------- SUMMARY -------- */}
      <div className="section">
        <h3>AI Summary</h3>

        {/* Display selected PDF name */}
        {file && (
          <p style={{ fontStyle: "italic", marginTop: "5px" }}>
            Selected PDF: {file.name}
          </p>
        )}

        {file && (
          <div className="file-row-container">
            <div className="file-row">
              <button onClick={generateSummary}>Generate Summary</button>
            </div>

            {summarySuccess && (
              <p style={{ color: "green", marginTop: "5px" }}>
                Generated summary successfully
              </p>
            )}
          </div>
        )}

        <div className="result-box">
          {summary ? (
            summary.split("\n").map((line, index, arr) => {
              let trimmed = line.trim();
              if (!trimmed) return null;

              // Merge a number on its own line with the next line
              if (/^\d+$/.test(trimmed) && arr[index + 1]) {
                trimmed = `${trimmed}. ${arr[index + 1].trim()}`;
                arr[index + 1] = ""; // skip next line
              }

              // Merge numbered items that start with digits but no period
              if (/^\d+\s/.test(trimmed)) {
                trimmed = trimmed.replace(/^(\d+)\s/, "$1. ");
              }

              // Bold headings (**...**)
              if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                return <strong key={index}>{trimmed.replace(/\*\*/g, "")}</strong>;
              }

              // Regular paragraph
              return <p key={index}>{trimmed}</p>;
            })
          ) : (
            <p>No summary available.</p>
          )}
        </div>
      </div>

      {/* -------- SEARCH -------- */}
      <div className="section">
        <h3>PDF Insights</h3>

        {/* Selected PDF (OUTSIDE box) */}
        {file && (
          <p style={{ fontStyle: "italic", marginTop: "5px" }}>
            Selected PDF: {file.name}
          </p>
        )}

        {/* Search row (OUTSIDE box) */}
        <div className="search-row">
          <input
            type="text"
            placeholder="Ask a question about the PDF..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Box with background like summary */}
        <div className="result-box">

          {/* Loading */}
          {searchLoading && <p>Searching...</p>}

          {/* Results */}
          {searchResult && !searchResult.error && (
            <>
              <h4>Answer:</h4>
              <p style={{ whiteSpace: "pre-line", marginBottom: "20px" }}>
                {searchResult.answer}
              </p>

              {searchResult.sources && searchResult.sources.length > 0 && (
                <>
                  <h4>Source Excerpts:</h4>
                  {searchResult.sources.map((src, idx) => (
                    <div key={idx} className="source-box">
                      {src
                        .replace(/\s{2,}/g, " ")
                        .replace(/\n+/g, "\n")}
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {/* Error */}
          {searchResult?.error && (
            <p style={{ color: "red" }}>{searchResult.error}</p>
          )}

          {/* No results */}
          {!searchResult && !searchLoading && <p>No results available.</p>}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Upload;
