import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
import { FiSend } from "react-icons/fi";
import "../../styles/GroupRoom.css";

export default function GroupRoomPage() {
  const { id } = useParams();
  const groupId = Number(id);
  const navigate = useNavigate();

  const {
    groups,
    users,
    sendGroupMessage,
    leaveGroup,
    addAnnouncement,
    removeMember,
    renameGroup,
    deleteGroup,
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);

  const currentUserId = Number(user?.id ?? 1);
  const [chatInput, setChatInput] = useState("");
  const [file, setFile] = useState(null);
  const [showMembers, setShowMembers] = useState(false); // toggle members visibility

  const group = groups?.find((g) => g.id === groupId);
  const owner = users?.find((u) => u.id === group?.ownerId);
  const isAdmin = group?.ownerId === currentUserId;

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!group) return;
    if (!group.members.includes(currentUserId)) {
      navigate("/rooms", { replace: true });
    }
  }, [group, currentUserId, navigate]);

  if (!group) return null;

  const handleExit = () => navigate("/rooms");

  const handleLeave = () => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      leaveGroup(groupId, currentUserId);
      navigate("/rooms", { replace: true });
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() && !file) return;

    const newMessage = {
      userId: currentUserId,
      content: chatInput.trim(),
      file: file && {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      },
    };

    sendGroupMessage(groupId, newMessage);
    setChatInput("");
    setFile(null);
  };

  // Auto-scroll to bottom whenever chat changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [group.chat]);

  return (
    <div className="group-room-container">
      {/* HEADER */}
      <header className="group-header">
        <div className="group-header-info">
          <h1>{group.name}</h1>
          <p className="group-subtitle">
            Hobby: {group.hobby} • Created by <span>{owner?.name || "Unknown"}</span>
          </p>
        </div>
        <div className="header-actions">
          <button onClick={handleExit} className="btn-exit">Exit</button>
          <button onClick={handleLeave} className="btn-leave">Leave Group</button>
        </div>
      </header>

      <main className="group-main">
        <aside className="group-sidebar">
          {/* ANNOUNCEMENTS */}
          <div className="group-announcements">
            <h3>📌 Announcements</h3>
            {group.announcements?.length ? (
              group.announcements.map((a) => (
                <div key={a.id} className="announcement-item">{a.content}</div>
              ))
            ) : (
              <p className="empty-text">No announcements yet</p>
            )}
            {isAdmin && (
              <button
                onClick={() =>
                  addAnnouncement?.(groupId, { id: Date.now(), content: "Group meeting tomorrow at 5 PM" })
                }
                className="btn-announce"
              >
                Add Announcement
              </button>
            )}
          </div>

          {/* MEMBERS BUTTON */}
          <button className="btn-members" onClick={() => setShowMembers(!showMembers)}>
            👥 Members ({group.members.length})
          </button>

          {/* MEMBERS LIST */}
          {showMembers && (
           
<div className={`group-members-container ${showMembers ? "open" : ""}`}>
  <ul className="group-members">
    {group.members.map((uid) => {
      const m = users?.find((u) => u.id === uid);
      return (
        <li key={uid} className="member-item">
          <div className="avatar">{m?.name?.charAt(0)}</div>
          <span>{m?.name || "Unknown"}</span>
          {isAdmin && uid !== currentUserId && (
            <button onClick={() => removeMember(groupId, uid)}>Remove</button>
          )}
        </li>
      );
    })}
  </ul>
</div>

          )}

          {/* ADMIN CONTROLS */}
          {isAdmin && (
            <div className="admin-controls">
              <h3>⚙️ Admin Controls</h3>
              <button onClick={() => renameGroup(groupId, prompt("New group name:"))}>Rename Group</button>
              <button onClick={() => deleteGroup(groupId)}>Delete Group</button>
            </div>
          )}

          {/* CHAT */}
          <div className="group-chat">
            <h3>💬 Group Chat</h3>
            <div className="chat-messages">
              {group.chat?.length ? (
                group.chat.map((msg, idx) => {
                  const sender = users?.find((u) => u.id === msg.userId);
                  const mine = msg.userId === currentUserId;
                  return (
                    <div key={idx} className={`chat-message ${mine ? "chat-right" : "chat-left"}`}>
                      <span className="chat-user">{sender?.name || "Unknown"}</span>
                      <p className="chat-text">{msg.content}</p>
                      {msg.file && (
                        <div className="chat-file">
                          {msg.file.type.startsWith("image/") && <img src={msg.file.url} alt="shared" />}
                          {msg.file.type.startsWith("video/") && <video controls src={msg.file.url}></video>}
                          {msg.file.type.startsWith("audio/") && <audio controls src={msg.file.url}></audio>}
                          {msg.file.type.includes("pdf") && <a href={msg.file.url} target="_blank" rel="noreferrer">📄 {msg.file.name}</a>}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="empty-text">No messages yet</p>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              />
              <button onClick={handleSendMessage}>
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

