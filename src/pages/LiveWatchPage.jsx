// src/pages/LiveWatchPage.jsx
//
// Route: /live-watch/:code
// - Fetches party info from backend using the code
// - Plays the movie video automatically
// - Opens shared chat room (same code = same room for everyone)
// - Host can end the party; all guests see "Host has ended the session"

import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";
import { BsChatDotsFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { getSocket } from "../socket"; // ← shared singleton (no local getSocket here)
import useFetchDetail from "../hooks/useFetchDetail";
import API_URL from "../config/api";
import ChatPanel from "../components/Chatpanel";

const LiveWatchPage = () => {
  const { code }    = useParams();
  const navigate    = useNavigate();
  const token       = sessionStorage.getItem("access_token") || "";
  const playerRef   = useRef(null);

  const [partyInfo,   setPartyInfo]   = useState(null);
  const [fetchError,  setFetchError]  = useState("");
  const [chatOpen,    setChatOpen]    = useState(true);
  const [chatVisible, setChatVisible] = useState(true);
  const [partyEnded,  setPartyEnded]  = useState(false);
  const [endedBy,     setEndedBy]     = useState("");
  const [myName,      setMyName]      = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  // ── Decode my username ────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setMyName(payload.sub || "");
    } catch {
      setMyName("");
    }
  }, [token]);

  // ── Fetch watch party info from backend ───────────────────────────────────
  useEffect(() => {
    const fetchParty = async () => {
      try {
        setPageLoading(true);
        const res  = await fetch(`${API_URL}/watch-party/${code}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          setFetchError(data.message || "Could not load watch party");
          return;
        }
        setPartyInfo(data);
      } catch {
        setFetchError("Failed to connect to server");
      } finally {
        setPageLoading(false);
      }
    };

    if (code && token) fetchParty();
  }, [code, token]);

  // ── Socket: listen for party_ended only ──────────────────────────────────
  // NOTE: joining the room is handled entirely by ChatPanel.
  // LiveWatchPage only needs to listen for the "party_ended" broadcast.
  useEffect(() => {
    if (!code) return;
    const socket = getSocket();

    const onPartyEnded = (data) => {
      setPartyEnded(true);
      setEndedBy(data.message || "Host has ended the session");
      if (playerRef.current) {
        try { playerRef.current.stopVideo(); } catch {}
      }
    };

    socket.on("party_ended", onPartyEnded);

    return () => {
      socket.off("party_ended", onPartyEnded);
    };
  }, [code]);

  // ── Fetch video key ───────────────────────────────────────────────────────
  const endpoint = partyInfo
    ? `/${partyInfo.media_type}/${partyInfo.movie_id}/videos`
    : null;

  const { data: videoData, loading: videoLoading } = useFetchDetail(endpoint);

  const videoKey = videoData?.results?.find((v) => v.site === "YouTube")?.key
    ?? videoData?.results?.[0]?.key;

  // ── isHost ────────────────────────────────────────────────────────────────
  const isHost = partyInfo?.host === myName;

  // ── Host ends party ───────────────────────────────────────────────────────
  const handleEndParty = () => {
    const socket = getSocket();
    socket.emit("end_party", { code, token });
  };

  // ── Chat toggle ───────────────────────────────────────────────────────────
  const handleToggleChat = () => {
    if (chatOpen) {
      setChatVisible(false);
      setTimeout(() => setChatOpen(false), 250);
    } else {
      setChatOpen(true);
      setTimeout(() => setChatVisible(true), 10);
    }
  };

  const onReady = (event) => { playerRef.current = event.target; };

  const opts = {
    width: "100%", height: "100%",
    playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
  };

  // ── Render states ─────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.spinner} />
        <span style={{ color: "#666", fontSize: "14px", marginTop: "14px" }}>
          Joining watch party...
        </span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div style={styles.centerScreen}>
        <HiUserGroup size={48} color="#333" />
        <p style={{ color: "#e50914", fontSize: "16px", marginTop: "16px", fontWeight: 600 }}>
          {fetchError}
        </p>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          Go Home
        </button>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.root}>

      <div style={{ height: "100px", flexShrink: 0, background: "#000" }} />

      <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>

        {/* ── Video Area ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative", height: "100%" }}>

          <div style={styles.topGradient} />

          {/* Party info badge */}
          <div style={styles.topLeft}>
            <div style={styles.redBar} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.4px" }}>
                Watch Party
              </span>
              <span style={{ color: "#666", fontSize: "12px", letterSpacing: "1px", fontWeight: 600 }}>
                #{code}
              </span>
            </div>
            <div style={styles.liveDot} />
            <span style={{ color: "#22c55e", fontSize: "11px", fontWeight: 700 }}>LIVE</span>
          </div>

          {videoLoading && (
            <div style={styles.videoOverlay}>
              <div style={styles.spinner} />
              <span style={{ color: "#666", fontSize: "14px", marginTop: "14px" }}>Loading video...</span>
            </div>
          )}

          {!videoLoading && !videoKey && (
            <div style={styles.videoOverlay}>
              <span style={{ color: "#444", fontSize: "15px" }}>No video available</span>
            </div>
          )}

          {!videoLoading && videoKey && (
            <YouTube
              videoId={videoKey}
              opts={opts}
              onReady={onReady}
              style={{ width: "100%", height: "100%" }}
              className="w-full h-full"
              iframeClassName="w-full h-full"
            />
          )}

          {/* Chat toggle */}
          <button
            onClick={handleToggleChat}
            style={{
              ...styles.chatToggleBtn,
              right:      chatOpen ? "354px" : "14px",
              background: chatOpen ? "rgba(229,9,20,0.9)" : "rgba(20,20,20,0.85)",
            }}
            onMouseEnter={(e) => { if (!chatOpen) e.currentTarget.style.background = "rgba(229,9,20,0.8)"; }}
            onMouseLeave={(e) => { if (!chatOpen) e.currentTarget.style.background = "rgba(20,20,20,0.85)"; }}
          >
            <BsChatDotsFill size={15} />
            {chatOpen ? "Hide Chat" : "Live Chat"}
          </button>

          {/* Host: End Party */}
          {isHost && !partyEnded && (
            <button
              onClick={handleEndParty}
              style={styles.endPartyBtn}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(229,9,20,0.9)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(229,9,20,0.6)"}
            >
              <HiUserGroup size={15} />
              End Party
            </button>
          )}

          {/* Party ended overlay */}
          {partyEnded && (
            <div style={styles.endedOverlay}>
              <div style={styles.endedBox}>
                <HiUserGroup size={40} color="#e50914" />
                <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, margin: "14px 0 6px" }}>
                  Watch Party Ended
                </h2>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
                  {endedBy}
                </p>
                <button onClick={() => navigate("/")} style={styles.backBtn}>
                  Go Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Chat Panel ─────────────────────────────────────────────────── */}
        {chatOpen && (
          <div
            style={{
              position:   "absolute",
              top:        0, right: 0,
              height:     "100%",
              zIndex:     20,
              transform:  chatVisible ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:  "-8px 0 40px rgba(0,0,0,0.7)",
            }}
          >
            {/* ChatPanel owns the join emit — roomCode tells it which room */}
            <ChatPanel
              onClose={handleToggleChat}
              roomCode={code}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(229,9,20,0.5); }
      `}</style>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  root: {
    width: "100vw", height: "100vh",
    background: "#000",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif",
  },
  centerScreen: {
    width: "100vw", height: "100vh", background: "#000",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  spinner: {
    width: "44px", height: "44px",
    border: "3px solid rgba(255,255,255,0.08)",
    borderTop: "3px solid #e50914",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  topGradient: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: "80px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)",
    pointerEvents: "none", zIndex: 5,
  },
  topLeft: {
    position: "absolute", top: "16px", left: "16px",
    zIndex: 10,
    display: "flex", alignItems: "center", gap: "10px",
  },
  redBar: {
    background: "#e50914", width: "4px", height: "28px", borderRadius: "2px",
  },
  liveDot: {
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#22c55e", boxShadow: "0 0 6px #22c55e", marginLeft: "4px",
  },
  videoOverlay: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "#000", zIndex: 10,
  },
  chatToggleBtn: {
    position: "absolute", top: "14px",
    zIndex: 30,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", color: "#fff",
    padding: "8px 14px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "13px", fontWeight: 600, letterSpacing: "0.3px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  endPartyBtn: {
    position: "absolute", top: "14px", left: "50%",
    transform: "translateX(-50%)",
    zIndex: 30,
    background: "rgba(229,9,20,0.6)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(229,9,20,0.4)",
    borderRadius: "10px", color: "#fff",
    padding: "8px 16px", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "7px",
    fontSize: "13px", fontWeight: 600,
    transition: "all 0.2s",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  endedOverlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.88)", zIndex: 50,
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)",
    animation: "fadeIn 0.3s ease",
  },
  endedBox: {
    background: "#141414",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "36px 40px",
    textAlign: "center", maxWidth: "360px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
  },
  backBtn: {
    background: "linear-gradient(135deg, #e50914, #b00710)",
    border: "none", borderRadius: "10px", color: "#fff",
    padding: "11px 28px", fontSize: "14px", fontWeight: 700, cursor: "pointer",
  },
};

export default LiveWatchPage;