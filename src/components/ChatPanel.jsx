// src/components/ChatPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { getSocket } from "../socket"; // ← shared singleton

const EMOJIS = ["😂", "❤️", "🔥", "👏", "😍", "😮", "😢", "👍", "🎬", "🍿", "💯", "🤣"];

const AVATAR_COLORS = ["#e50914", "#0070f3", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];
const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Main Component ────────────────────────────────────────────────────────────
// roomCode → watch-party room  (e.g. "XR7T9")
// movieId  → normal video page (builds "movie-278")
const ChatPanel = ({ onClose, movieId = 278, roomCode = null }) => {
  const room  = roomCode ? roomCode : `movie-${movieId}`;
  const token = sessionStorage.getItem("access_token") || "";

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [connected, setConnected] = useState(false);
  const [myName, setMyName]       = useState("You");

  const myNameRef = useRef("You");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const joinedRef = useRef(false); // guard: emit join only once per room mount

  // ── Decode username from JWT ──────────────────────────────────────────────
  useEffect(() => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name = payload.sub || payload.username || payload.name || "You";
      setMyName(name);
      myNameRef.current = name;
    } catch {
      setMyName("You");
      myNameRef.current = "You";
    }
  }, [token]);

  // ── Socket lifecycle: connect + listen ───────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setConnected(true);
      // Re-join the room if the socket reconnects (e.g. after a network drop)
      socket.emit("join", { room, token });
    };

    const onDisconnect = () => setConnected(false);

    const onMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id:        Date.now() + Math.random(),
          user:      data.user,
          avatar:    data.avatar,
          message:   data.message,
          timestamp: data.timestamp,
          isSelf:    data.user === myNameRef.current,
        },
      ]);
    };

    const onSystemMessage = (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id:        Date.now() + Math.random(),
          isSystem:  true,
          message:   data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    };

    // ── Join the room ─────────────────────────────────────────────────────
    // Always join from ChatPanel — this is the single source of truth.
    // LiveWatchPage no longer emits join; ChatPanel owns it.
    if (socket.connected) {
      setConnected(true);
      if (!joinedRef.current) {
        joinedRef.current = true;
        socket.emit("join", { room, token });
      }
    }

    socket.on("connect",         onConnect);
    socket.on("disconnect",      onDisconnect);
    socket.on("receive_message", onMessage);
    socket.on("system_message",  onSystemMessage);

    return () => {
      socket.off("connect",         onConnect);
      socket.off("disconnect",      onDisconnect);
      socket.off("receive_message", onMessage);
      socket.off("system_message",  onSystemMessage);
      // Reset join guard when room changes so re-mounting joins cleanly
      joinedRef.current = false;
    };
  }, [room, token]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !connected) return;
    const socket = getSocket();
    socket.emit("send_message", { room, message: trimmed, token });
    setInput("");
    setShowEmoji(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: "340px",
        height: "100%",
        background: "linear-gradient(180deg, #141414 0%, #0a0a0a 100%)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', sans-serif",
        flexShrink: 0,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: connected ? "#22c55e" : "#ef4444",
              boxShadow: connected ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
              transition: "all 0.4s",
            }}
          />
          <span style={{ color: "#fff", fontWeight: 600, fontSize: "15px", letterSpacing: "0.3px" }}>
            Live Chat
          </span>
          <span
            style={{
              background: connected ? "rgba(229,9,20,0.15)" : "rgba(100,100,100,0.2)",
              color: connected ? "#e50914" : "#888",
              fontSize: "11px", fontWeight: 700,
              padding: "2px 8px", borderRadius: "20px",
              border: `1px solid ${connected ? "rgba(229,9,20,0.3)" : "rgba(100,100,100,0.3)"}`,
              transition: "all 0.3s",
            }}
          >
            {connected ? "● LIVE" : "Connecting..."}
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)", border: "none",
            color: "#aaa", cursor: "pointer", borderRadius: "6px",
            padding: "4px", display: "flex", alignItems: "center", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(229,9,20,0.2)"; e.currentTarget.style.color = "#e50914"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#aaa"; }}
        >
          <IoIosClose size={20} />
        </button>
      </div>

      {/* Room label */}
      <div
        style={{
          padding: "6px 14px",
          background: "rgba(229,9,20,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          color: "#555", fontSize: "11px", letterSpacing: "0.4px", fontWeight: 500,
        }}
      >
        # {room}
      </div>

      {/* ── Messages ───────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1, overflowY: "auto",
          padding: "14px 12px",
          display: "flex", flexDirection: "column", gap: "14px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "10px", color: "#444", paddingTop: "60px", textAlign: "center",
            }}
          >
            <span style={{ fontSize: "32px" }}>🎬</span>
            <span style={{ fontSize: "13px", lineHeight: 1.6 }}>
              No messages yet.<br />Be the first to say something!
            </span>
          </div>
        )}

        {messages.map((msg) =>
          msg.isSystem ? (
            <div
              key={msg.id}
              style={{
                textAlign: "center", color: "#444",
                fontSize: "11.5px", padding: "2px 0", fontStyle: "italic",
              }}
            >
              {msg.message}
            </div>
          ) : (
            <div
              key={msg.id}
              style={{
                display: "flex", gap: "10px",
                flexDirection: msg.isSelf ? "row-reverse" : "row",
                animation: "fadeSlideIn 0.22s ease",
              }}
            >
              <div
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: getAvatarColor(msg.user),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "13px", color: "#fff", flexShrink: 0,
                }}
              >
                {msg.avatar}
              </div>
              <div
                style={{
                  maxWidth: "75%", display: "flex", flexDirection: "column",
                  gap: "3px", alignItems: msg.isSelf ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexDirection: msg.isSelf ? "row-reverse" : "row" }}>
                  <span style={{ color: msg.isSelf ? "#e50914" : "#ccc", fontSize: "12px", fontWeight: 600 }}>
                    {msg.isSelf ? "You" : msg.user}
                  </span>
                  <span style={{ color: "#555", fontSize: "10px" }}>{msg.timestamp}</span>
                </div>
                <div
                  style={{
                    background: msg.isSelf ? "linear-gradient(135deg, #e50914, #b00710)" : "rgba(255,255,255,0.07)",
                    color: "#f0f0f0", padding: "9px 13px",
                    borderRadius: msg.isSelf ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                    fontSize: "13.5px", lineHeight: "1.5",
                    border: msg.isSelf ? "none" : "1px solid rgba(255,255,255,0.07)",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Emoji Picker ───────────────────────────────────────────────────── */}
      {showEmoji && (
        <div
          style={{
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", flexWrap: "wrap", gap: "8px",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", padding: "6px 8px",
                fontSize: "18px", cursor: "pointer", transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.25)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── Input Area ─────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", gap: "8px", alignItems: "center",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <button
          onClick={() => setShowEmoji((p) => !p)}
          style={{
            background: showEmoji ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${showEmoji ? "rgba(229,9,20,0.4)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: "10px", padding: "8px",
            color: showEmoji ? "#e50914" : "#aaa",
            cursor: "pointer", display: "flex", alignItems: "center",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          <BsEmojiSmile size={18} />
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? "Say something..." : "Connecting..."}
          disabled={!connected}
          style={{
            flex: 1,
            background: connected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "9px 14px",
            color: "#fff", fontSize: "13.5px", outline: "none",
            transition: "border-color 0.2s",
            cursor: connected ? "text" : "not-allowed",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(229,9,20,0.5)")}
          onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />

        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          style={{
            background: input.trim() && connected
              ? "linear-gradient(135deg, #e50914, #b00710)"
              : "rgba(255,255,255,0.06)",
            border: "none", borderRadius: "10px", padding: "9px 12px",
            color: input.trim() && connected ? "#fff" : "#555",
            cursor: input.trim() && connected ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center",
            transition: "all 0.2s", flexShrink: 0,
          }}
        >
          <IoSend size={17} />
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default ChatPanel;