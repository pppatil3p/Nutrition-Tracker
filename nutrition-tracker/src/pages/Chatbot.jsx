import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your Nutrition Assistant. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/gemini", { message: input });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }

    setLoading(false);
  };

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-neutral-100 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 shadow-md p-5 text-center">
        <h1 className="text-3xl font-bold text-white tracking-wide">Nutrition Expert Chatbot</h1>
        <p className="text-sm text-violet-300 mt-1">Your personal nutrition assistant</p>
      </header>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-neutral-950 to-black scrollbar-thin scrollbar-thumb-violet-700 scrollbar-track-neutral-800"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-5 py-3 max-w-[80%] break-words rounded-2xl shadow transition-all duration-300 ${
              msg.sender === "user"
                ? "ml-auto bg-gradient-to-r from-purple-600 to-violet-700 text-white rounded-br-none hover:brightness-110"
                : "mr-auto bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-bl-none hover:bg-neutral-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="italic text-violet-400 animate-pulse">Bot is typing...</div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center border-t border-neutral-800 bg-neutral-900 p-3">
        <input
          type="text"
          className="flex-1 bg-neutral-800 text-neutral-100 px-4 py-3 rounded-l-full focus:outline-none focus:ring-2 focus:ring-violet-600 placeholder-neutral-500 transition"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 active:from-purple-700 active:to-violet-800 text-white px-6 py-3 rounded-r-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
