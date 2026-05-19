import { useState, useRef, useEffect } from "react";
import api from "../../services/api";

const BOT_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="12" r="1.5" fill="currentColor" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    <path d="M8 6V4.5a4 4 0 018 0V6" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const USER_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SEND_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function TypingDots() {
  return (
    <div style={s.row}>
      <div style={{ ...s.avatar, background: "#f3f4f6", color: "#6366f1" }}>{BOT_ICON}</div>
      <div style={{ ...s.bubble, ...s.bubbleBot, padding: "10px 14px", display: "flex", alignItems: "center", gap: "4px" }}>
        {[0, 160, 320].map(delay => (
          <span key={delay} style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#9ca3af", animation: "blink 1.2s infinite ease-in-out", animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages(prev => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", { message: trimmed });
      const reply = res.data.reply;
      setMessages(prev => [
        ...prev,
        { role: "bot", text: typeof reply === "string" ? reply : JSON.stringify(reply) }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again.", isError: true }
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');
        .chat-wrap * { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,80%,100% { opacity:.2; transform:scale(.8); } 40% { opacity:1; transform:scale(1); } }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .chat-input-el { outline: none; border: none; width: 100%; background: transparent; font-size: 14px; color: #374151; font-family: 'Outfit', sans-serif; }
        .chat-input-el::placeholder { color: #9ca3af; }
        .send-btn:hover { background: #4f46e5 !important; }
        .send-btn:active { transform: scale(0.95); }
        .msg-row { animation: fadeUp 0.22s ease both; }
      `}</style>

      <div className="chat-wrap" style={s.card}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <span style={s.onlineDot} />
            <span style={s.headerTitle}>Ai Work Assistant</span>
          </div>
          <span style={s.headerSub}>AI · Online</span>
        </div>

        <div className="chat-scroll" style={s.body}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className="msg-row"
              style={{ ...s.row, flexDirection: msg.role === "user" ? "row-reverse" : "row", animationDelay: `${i * 15}ms` }}
            >
              <div style={{
                ...s.avatar,
                background: msg.role === "user" ? "#6366f1" : "#f3f4f6",
                color: msg.role === "user" ? "#fff" : "#6366f1"
              }}>
                {msg.role === "user" ? USER_ICON : BOT_ICON}
              </div>
              <div style={{
                ...s.bubble,
                ...(msg.role === "user" ? s.bubbleUser : s.bubbleBot),
                ...(msg.isError ? s.bubbleErr : {})
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        <div style={s.inputWrap}>
          <div style={s.inputBox}>
            <input
              ref={inputRef}
              className="chat-input-el"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type your message..."
            />
          </div>
          <button
            className="send-btn"
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              ...s.sendBtn,
              opacity: !input.trim() || loading ? 0.5 : 1,
              cursor: !input.trim() || loading ? "not-allowed" : "pointer"
            }}
          >
            {SEND_ICON}
          </button>
        </div>
      </div>
    </>
  );
}

const s = {
  card: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid #f3f4f6",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
  onlineDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", display: "inline-block" },
  headerTitle: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  headerSub: { fontSize: "12px", color: "#9ca3af" },
  body: {
    flex: 1,
    minHeight: "320px",
    maxHeight: "420px",
    overflowY: "auto",
    padding: "18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: { display: "flex", alignItems: "flex-end", gap: "8px" },
  avatar: { width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bubble: { maxWidth: "75%", padding: "10px 14px", fontSize: "14px", lineHeight: "1.55", borderRadius: "12px" },
  bubbleBot: { background: "#f3f4f6", color: "#374151", borderBottomLeftRadius: "3px" },
  bubbleUser: { background: "#6366f1", color: "#fff", borderBottomRightRadius: "3px" },
  bubbleErr: { background: "#fef2f2", color: "#dc2626" },
  inputWrap: { display: "flex", alignItems: "center", gap: "8px", padding: "12px 14px", borderTop: "1px solid #f3f4f6" },
  inputBox: { flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "9px 13px" },
  sendBtn: { width: "38px", height: "38px", borderRadius: "8px", background: "#6366f1", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s, transform 0.1s, opacity 0.15s" },
};