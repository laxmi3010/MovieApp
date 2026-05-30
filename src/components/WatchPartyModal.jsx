// src/components/WatchPartyModal.jsx
//
// Usage on your movie detail page:
//   <WatchPartyModal movieId={278} mediaType="movie" />
//
// Shows a "Start Watch Party" button (premium only).
// On click → calls backend → shows generated link for user to copy.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { HiUserGroup } from "react-icons/hi";
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";
import API_URL from "../config/api";

const WatchPartyModal = ({ movieId, mediaType = "movie" }) => {
  const navigate = useNavigate();
  const [isOpen,   setIsOpen]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [code,     setCode]     = useState(null);   // generated room code
  const [copied,   setCopied]   = useState(false);
  const [error,    setError]    = useState("");

  const token = sessionStorage.getItem("access_token");
  const fullLink = code ? `${window.location.origin}/live-watch/${code}` : "";

  // ── Create watch party ──────────────────────────────────────────────────────
  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/create-watch-party`, {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${token}`,
        },
        body: JSON.stringify({ movie_id: movieId, media_type: mediaType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create watch party");
        return;
      }

      setCode(data.code);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Copy link then redirect ─────────────────────────────────────────────────
  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    // Redirect to the live watch page after a short delay so user sees "Copied!"
    setTimeout(() => {
      navigate(`/live-watch/${code}`);
    }, 800);
  };

  // ── Reset on close ──────────────────────────────────────────────────────────
  const handleClose = () => {
    setIsOpen(false);
    setCode(null);
    setError("");
    setCopied(false);
  };

  return (
    <>
      {/* ── Trigger Button ───────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            "8px",
          background:     "rgba(255,255,255,0.08)",
          border:         "1px solid rgba(255,255,255,0.15)",
          borderRadius:   "10px",
          color:          "#fff",
          padding:        "10px 18px",
          fontSize:       "14px",
          fontWeight:     600,
          cursor:         "pointer",
          transition:     "all 0.2s",
          fontFamily:     "'Segoe UI', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background   = "rgba(229,9,20,0.2)";
          e.currentTarget.style.borderColor  = "rgba(229,9,20,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background   = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor  = "rgba(255,255,255,0.15)";
        }}
      >
        <HiUserGroup size={18} />
        Watch Party
      </button>

      {/* ── Modal Backdrop ───────────────────────────────────────────────── */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position:   "fixed",
            inset:      0,
            background: "rgba(0,0,0,0.75)",
            zIndex:     100,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {/* ── Modal Box ─────────────────────────────────────────────────── */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:   "#141414",
              border:       "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              width:        "420px",
              padding:      "28px",
              fontFamily:   "'Segoe UI', sans-serif",
              boxShadow:    "0 24px 60px rgba(0,0,0,0.8)",
              animation:    "slideUp 0.25s ease",
              position:     "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              style={{
                position:   "absolute",
                top:        "14px",
                right:      "14px",
                background: "rgba(255,255,255,0.06)",
                border:     "none",
                borderRadius: "6px",
                color:      "#aaa",
                cursor:     "pointer",
                padding:    "4px",
                display:    "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
            >
              <IoIosClose size={22} />
            </button>

            {/* Icon + Title */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div
                style={{
                  background:   "rgba(229,9,20,0.15)",
                  border:       "1px solid rgba(229,9,20,0.3)",
                  borderRadius: "10px",
                  padding:      "10px",
                  display:      "flex",
                  alignItems:   "center",
                }}
              >
                <HiUserGroup size={22} color="#e50914" />
              </div>
              <div>
                <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  Watch Party
                </h2>
                <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
                  Invite friends to watch together
                </p>
              </div>
            </div>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "20px 0" }} />

            {/* ── State: not yet created ─────────────────────────────────── */}
            {!code && (
              <>
                <p style={{ color: "#aaa", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
                  Start a watch party for this movie. A unique link will be generated —
                  share it with anyone you want to watch with.
                </p>

                {error && (
                  <div
                    style={{
                      background:   "rgba(229,9,20,0.1)",
                      border:       "1px solid rgba(229,9,20,0.3)",
                      borderRadius: "8px",
                      padding:      "10px 14px",
                      color:        "#e50914",
                      fontSize:     "13px",
                      marginBottom: "16px",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={handleStart}
                  disabled={loading}
                  style={{
                    width:        "100%",
                    background:   loading ? "rgba(229,9,20,0.4)" : "linear-gradient(135deg, #e50914, #b00710)",
                    border:       "none",
                    borderRadius: "10px",
                    color:        "#fff",
                    padding:      "13px",
                    fontSize:     "15px",
                    fontWeight:   700,
                    cursor:       loading ? "not-allowed" : "pointer",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    gap:          "8px",
                    transition:   "opacity 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: "16px", height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <HiUserGroup size={17} />
                      Start Watch Party
                    </>
                  )}
                </button>
              </>
            )}

            {/* ── State: link created ────────────────────────────────────── */}
            {code && (
              <>
                {/* Success badge */}
                <div
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    background:   "rgba(34,197,94,0.1)",
                    border:       "1px solid rgba(34,197,94,0.25)",
                    borderRadius: "8px",
                    padding:      "10px 14px",
                    marginBottom: "18px",
                    color:        "#22c55e",
                    fontSize:     "13px",
                    fontWeight:   600,
                  }}
                >
                  <IoCheckmark size={16} />
                  Watch party created! Share the link below.
                </div>

                {/* Room code badge */}
                <div style={{ marginBottom: "14px", textAlign: "center" }}>
                  <span style={{ color: "#555", fontSize: "12px", letterSpacing: "0.5px" }}>
                    ROOM CODE
                  </span>
                  <div
                    style={{
                      color:        "#fff",
                      fontSize:     "28px",
                      fontWeight:   800,
                      letterSpacing: "6px",
                      marginTop:    "4px",
                    }}
                  >
                    {code}
                  </div>
                </div>

                {/* Full link + copy */}
                <div
                  style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "8px",
                    background:   "rgba(255,255,255,0.05)",
                    border:       "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    padding:      "10px 14px",
                  }}
                >
                  <span
                    style={{
                      flex:       1,
                      color:      "#aaa",
                      fontSize:   "13px",
                      overflow:   "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fullLink}
                  </span>
                  <button
                    onClick={handleCopy}
                    style={{
                      background:   copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                      border:       `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "8px",
                      color:        copied ? "#22c55e" : "#fff",
                      padding:      "6px 12px",
                      fontSize:     "12px",
                      fontWeight:   600,
                      cursor:       "pointer",
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "5px",
                      transition:   "all 0.2s",
                      flexShrink:   0,
                    }}
                  >
                    {copied ? <IoCheckmark size={14} /> : <IoCopyOutline size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <p style={{ color: "#555", fontSize: "12px", marginTop: "12px", textAlign: "center" }}>
                  Anyone with this link who is a premium member can join
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin    { to { transform: rotate(360deg) } }
      `}</style>
    </>
  );
};

export default WatchPartyModal;