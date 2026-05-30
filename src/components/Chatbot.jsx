import React, { useState, useRef, useEffect } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageCircle, X, Send } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#a78bfa",
          display: "inline-block",
          animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes typingBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey there 👋 I'm your movie assistant. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isTyping]);

  const handleOpen = () => {
    const isPremium = sessionStorage.getItem("premium_member");
    if (isPremium === "true") {
      setIsOpen(true);
    } else {
      toast.error("🔒 Membership required! Upgrade to Premium to use the chatbot.", {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
          background: "#1a0a3d",
          color: "#fff",
          border: "1px solid #7c3aed",
          borderRadius: "12px",
        },
      });
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/chat-bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await response.json();
      const reply = data?.reply || "Sorry, I couldn't understand that.";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toast Container — positioned above the chatbot floating button */}
      <ToastContainer
        style={{ bottom: 100, right: 28, position: "fixed" }}
      />
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          title="Chat with us"
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 24px 0 rgba(124,58,237,0.55)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 32px 0 rgba(124,58,237,0.75)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 24px 0 rgba(124,58,237,0.55)";
          }}
        >
          <MessageCircle size={26} color="#fff" />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            zIndex: 9999,
            width: 360,
            height: 500,
            borderRadius: 20,
            background: "#0d0d0d",
            border: "1px solid rgba(124,58,237,0.35)",
            boxShadow: "0 8px 48px 0 rgba(124,58,237,0.3), 0 2px 16px rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp 0.25s ease",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(24px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .chat-scroll::-webkit-scrollbar { width: 4px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: #3b2a6e; border-radius: 4px; }
          `}</style>

          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              background: "linear-gradient(90deg, #1a0a3d 0%, #0d0d0d 100%)",
              borderBottom: "1px solid rgba(124,58,237,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={16} color="#fff" />
              </div>
              <div>
                <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>
                  Movie Assistant
                </p>
                <p style={{ margin: 0, color: "#a78bfa", fontSize: 11 }}>● Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#888",
                display: "flex",
                alignItems: "center",
                padding: 4,
                borderRadius: 6,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                        : "#1c1c1c",
                    border: msg.role === "bot" ? "1px solid rgba(124,58,237,0.2)" : "none",
                    color: "#fff",
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    background: "#1c1c1c",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: "18px 18px 18px 4px",
                  }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(124,58,237,0.15)",
              background: "#111",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                background: "#1c1c1c",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 12,
                padding: "10px 14px",
                color: "#fff",
                fontSize: 13,
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.25)")}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background:
                  !input.trim() || isTyping
                    ? "#2a2a2a"
                    : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                border: "none",
                cursor: !input.trim() || isTyping ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s, transform 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (input.trim() && !isTyping)
                  e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Send size={16} color={!input.trim() || isTyping ? "#555" : "#fff"} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;