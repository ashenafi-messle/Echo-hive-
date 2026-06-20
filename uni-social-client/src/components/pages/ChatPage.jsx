import React, { useState, useRef, useEffect } from "react";
import { FaSmile, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import "../../styles/Chat.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: "Alice", 
      type: "text", 
      content: "Hey, are you coming to class?", 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    },
    { 
      id: 2, 
      sender: "You", 
      type: "text", 
      content: "Yes, on my way!", 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [inputFile, setInputFile] = useState(null);
  const messagesEndRef = useRef(null);

  // Format timestamp function
  const formatTime = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = () => {
    if (!inputText && !inputFile) return;

    let type = "text";
    if (inputFile) {
      if (inputFile.type.startsWith("image")) type = "image";
      else if (inputFile.type.startsWith("audio")) type = "audio";
      else if (inputFile.type.startsWith("video")) type = "video";
    }

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      type,
      content: inputFile ? URL.createObjectURL(inputFile) : inputText,
      time: formatTime(), // 👈 add automatic timestamp
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setInputFile(null);
  };

  const handleFileChange = (e) => {
    setInputFile(e.target.files[0]);
  };

  const handleEmojiInsert = (emoji) => {
    setInputText(inputText + emoji);
  };

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatpage-container">
      <h2 className="chatpage-title">Chat</h2>

      <div className="chat-window">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === "You" ? "sent" : "received"}`}
          >
            <div className="message-content">
              {msg.type === "text" && <span>{msg.content}</span>}
              {msg.type === "image" && <img src={msg.content} alt="sent-img" />}
              {msg.type === "audio" && <audio controls src={msg.content} />}
              {msg.type === "video" && <video controls src={msg.content} />}
            </div>
            <div className="message-sender">
              {msg.sender} • <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <button className="emoji-btn" onClick={() => handleEmojiInsert("😊")}>
          <FaSmile />
        </button>

        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="chat-input"
        />

        <input
          type="file"
          accept="image/*,audio/*,video/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="file-btn">
          <FaPaperclip />
        </label>

        <button className="send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
