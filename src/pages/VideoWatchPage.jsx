// src/pages/VideoWatchPage.jsx
import React, { useRef, useState } from "react";
import YouTube from "react-youtube";
import { IoIosClose } from "react-icons/io";
import { BsChatDotsFill } from "react-icons/bs";
import useFetchDetail from "../hooks/useFetchDetail";
import ChatPanel from "../components/ChatPanel";

const VideoWatchPage = () => {
  // Hardcoded for now — you can make this dynamic later
  const MOVIE_ID = 278;
  const MEDIA_TYPE = "movie";

  const [chatOpen, setChatOpen] = useState(true);
  const [chatVisible, setChatVisible] = useState(true); // for animation
  const playerRef = useRef(null);

  const { data: videoData, loading } = useFetchDetail(`/${MEDIA_TYPE}/${MOVIE_ID}/videos`);

  // Pick first valid YouTube result
  const videoKey = videoData?.results?.find((v) => v.site === "YouTube")?.key
    ?? videoData?.results?.[0]?.key;

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const handleToggleChat = () => {
    if (chatOpen) {
      setChatVisible(false);
      setTimeout(() => setChatOpen(false), 250);
    } else {
      setChatOpen(true);
      setTimeout(() => setChatVisible(true), 10);
    }
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Top margin spacer */}
      <div style={{ height: "100px", flexShrink: 0, background: "#000" }} />

      {/* Main content row */}
      <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
      {/* ===== VIDEO AREA (always full width, chat overlaps) ===== */}
      <div style={{ flex: 1, position: "relative", height: "100%" }}>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#000",
              zIndex: 10,
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTop: "3px solid #e50914",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ color: "#888", fontSize: "14px", letterSpacing: "0.5px" }}>
              Loading video...
            </span>
          </div>
        )}

        {/* No Video State */}
        {!loading && !videoKey && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#555",
              fontSize: "16px",
            }}
          >
            No video available
          </div>
        )}

        {/* YouTube Player */}
        {!loading && videoKey && (
          <YouTube
            videoId={videoKey}
            opts={opts}
            className="w-full h-full"
            iframeClassName="w-full h-full"
            onReady={onReady}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {/* Top-left gradient bar — branding touch */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Movie title badge (top left) */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "#e50914",
              width: "4px",
              height: "22px",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "0.5px",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            The Shawshank Redemption
          </span>
        </div>

        {/* ===== CHAT TOGGLE BUTTON (top right) ===== */}
        <button
          onClick={handleToggleChat}
          title={chatOpen ? "Close Chat" : "Open Chat"}
          style={{
            position: "absolute",
            top: "14px",
            right: chatOpen ? "354px" : "14px",
            zIndex: 30,
            background: chatOpen
              ? "rgba(229,9,20,0.9)"
              : "rgba(20,20,20,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px",
            color: "#fff",
            padding: "8px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.3px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          onMouseEnter={(e) => {
            if (!chatOpen) e.currentTarget.style.background = "rgba(229,9,20,0.8)";
          }}
          onMouseLeave={(e) => {
            if (!chatOpen) e.currentTarget.style.background = "rgba(20,20,20,0.85)";
          }}
        >
          <BsChatDotsFill size={15} />
          {chatOpen ? "Hide Chat" : "Live Chat"}
        </button>
      </div>

      {/* ===== CHAT PANEL (overlaps video on right) ===== */}
      {chatOpen && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            zIndex: 20,
            transform: chatVisible ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.7)",
          }}
        >
          <ChatPanel onClose={handleToggleChat} />
        </div>
      )}
      </div> {/* end main content row */}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(229,9,20,0.5); }
      `}</style>
    </div>
  );
};

export default VideoWatchPage;