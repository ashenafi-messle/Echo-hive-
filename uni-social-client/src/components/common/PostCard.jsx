import React, { useState } from "react";
import "../../styles/PostCard.css";
import api from "../../api";

function PostCard({ post, currentUser, onEdit, onDelete }) {
  if (!post) return null; // Guard

  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentInput, setCommentInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");

  // Toggle like
  const handleLike = async () => {
    try {
      await api.put(`/posts/${post._id}/like`, { userId: currentUser._id });
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (err) {
      console.error("❌ Failed to like:", err.response?.data || err.message);
    }
  };

  // Toggle comment section
  const handleCommentToggle = () => setShowComments(!showComments);

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    try {
      const res = await api.put(`/posts/${post._id}/comment`, {
        userId: currentUser._id,
        comment: commentInput,
      });
      setComments(res.data.post.comments);
      setCommentInput("");
    } catch (err) {
      console.error("❌ Failed to comment:", err.response?.data || err.message);
    }
  };

  // Edit mode toggle
  const handleEditToggle = () => setIsEditing(!isEditing);

  // Save edited post
  const handleEditSubmit = async () => {
    try {
      const res = await api.put(`/posts/${post._id}`, { content: editContent });
      onEdit(res.data.post);
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Failed to edit post:", err.response?.data || err.message);
      alert("Failed to edit post.");
    }
  };

  // Delete post
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(post._id);
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <img
          className="avatar"
          src={post.avatar || "/default-avatar.png"}
          alt={post.user || "User"}
          onError={(e) => (e.target.src = "/default-avatar.png")}
        />
        <div className="post-user-info">
          <strong>{post.user || "Unknown"}</strong>
          <span className="time">{post.time || ""}</span>
        </div>

        {currentUser?._id === post.userId && (
          <div className="post-actions-user">
            <button onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="post-content">
        {isEditing ? (
          <>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <button className="save-btn" onClick={handleEditSubmit}>
              Save
            </button>
          </>
        ) : (
          <p>{post.content || ""}</p>
        )}

        {post.media &&
          (post.mediaType === "image" ? (
            <img src={post.media} alt="post" className="post-media" />
          ) : post.mediaType === "audio" ? (
            <audio controls src={post.media} className="post-media" />
          ) : post.mediaType === "video" ? (
            <video controls src={post.media} className="post-media" />
          ) : null)}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button onClick={handleLike}>
          {liked ? "❤️ Liked" : "🤍 Like"} ({likes})
        </button>
        <button onClick={handleCommentToggle}>
          💬 Comment ({comments.length})
        </button>
        <button onClick={() => alert("Post shared!")}>🔗 Share</button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments">
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
              {c.text || c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostCard;

