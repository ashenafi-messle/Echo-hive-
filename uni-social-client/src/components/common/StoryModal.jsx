import React, { useState, useEffect, useContext } from "react";
import "../../styles/StoryModal.css";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api";

export default function StoryModal({ storyId, onClose, onAddStory }) {
  const { user } = useContext(AuthContext);

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add story form
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [caption, setCaption] = useState("");

  // Story interactions
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  // Fetch story when storyId is provided
  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;
      try {
        const res = await api.get(`/stories/${storyId}`);
        setStory(res.data.story);
        setLikes(res.data.story.likes || 0);
        setLiked(res.data.story.likesUsers?.includes(user?._id) || false);
        setComments(res.data.story.comments || []);
        setEditContent(res.data.story.content || "");
      } catch (err) {
        console.error("Failed to fetch story:", err.response?.data || err.message);
      }
    };

    fetchStory();
  }, [storyId, user]);

  // Like story
  const handleLike = async () => {
    if (!story || !user) return;
    try {
      const res = await api.put(`/stories/${story._id}/like`, { userId: user._id });
      setLikes(res.data.story.likes);
      setLiked(res.data.story.likesUsers.includes(user._id));
    } catch (err) {
      console.error("Failed to like story:", err.response?.data || err.message);
    }
  };

  // Add comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim() || !story || !user) return;

    try {
      const res = await api.put(`/stories/${story._id}/comment`, {
        userId: user._id,
        comment: commentInput,
      });
      setComments(res.data.story.comments);
      setCommentInput("");
    } catch (err) {
      console.error("Failed to add comment:", err.response?.data || err.message);
    }
  };

  // Edit story
  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleEditSubmit = async () => {
    if (!story) return;
    try {
      const res = await api.put(`/stories/${story._id}`, { content: editContent });
      setEditContent(res.data.story.content);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to edit story:", err.response?.data || err.message);
    }
  };

  // Add new story
  const handleSubmitStory = async (e) => {
    e.preventDefault();

    // Require either file or caption
    if (!file && !caption.trim()) {
      return alert("Please select a file or add a caption");
    }

    const formData = new FormData();
    if (file) formData.append("media", file);
    formData.append("userId", user._id);
    formData.append("mediaType", file ? mediaType : "text");
    formData.append("content", caption || "");

    try {
      setLoading(true);
      const res = await api.post("/stories", formData); // Axios handles headers
      onAddStory(res.data.story);

      // Reset form
      setFile(null);
      setCaption("");
      setMediaType("image");
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("❌ Failed to upload story:", err.response?.data || err.message);
      alert("Failed to upload story.");
      setLoading(false);
    }
  };

  // Safe rendering helpers
  const renderAvatar = () =>
    story?.avatar ? <img src={story.avatar} alt={story.name} className="story-avatar" /> : null;

  const renderMedia = () => {
    if (!story?.media) return null;

    switch (story.mediaType) {
      case "image":
        return <img src={story.media} alt="story" className="story-media" />;
      case "video":
        return <video src={story.media} controls autoPlay className="story-media" />;
      case "audio":
        return <audio src={story.media} controls autoPlay className="story-media" />;
      default:
        return null;
    }
  };

  // 🟢 View Story Mode
  if (storyId && story) {
    return (
      <div className="story-modal-overlay" onClick={onClose}>
        <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
          {renderAvatar()}
          <h2>{story.name}</h2>
          {renderMedia()}

          {isEditing ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="story-edit-textarea"
              />
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={handleEditToggle}>Cancel</button>
            </>
          ) : (
            <p>{editContent}</p>
          )}

          <div className="story-actions">
            <button onClick={handleLike}>
              {liked ? "❤️ Liked" : "🤍 Like"} ({likes})
            </button>
            <button>💬 Comment ({comments.length})</button>
            {story.userId === user?._id && (
              <button onClick={handleEditToggle}>
                {isEditing ? "Cancel Edit" : "Edit"}
              </button>
            )}
          </div>

          <div className="story-comments">
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button type="submit">Post</button>
            </form>
            {comments.map((c, i) => (
              <div key={i} className="comment">
                <strong>{c.userName || c.user}:</strong> {c.text}
              </div>
            ))}
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Add Story Mode
  if (!storyId) {
    return (
      <div className="story-modal-overlay" onClick={onClose}>
        <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Add New Story</h2>
          <form onSubmit={handleSubmitStory} className="add-story-form">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <select value={mediaType} onChange={(e) => setMediaType(e.target.value)}>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Add Story"}
            </button>
          </form>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
