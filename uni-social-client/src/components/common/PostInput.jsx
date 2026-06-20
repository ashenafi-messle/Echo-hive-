import React, { useState, useContext } from "react";
import "../../styles/PostInput.css";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";

function PostInput({ onPost }) {
  const { user: currentUser } = useContext(AuthContext);

  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle media selection for normal posts
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPostMedia(file);
    setMediaType(
      file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("audio")
        ? "audio"
        : "video"
    );
  };

  // Submit normal post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent && !postMedia) return;
    if (!currentUser) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", currentUser.id);
      formData.append("content", postContent);

      if (postMedia) {
        formData.append("media", postMedia);
        formData.append("mediaType", mediaType);
      }

      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const post = res.data.post;

      onPost({
        _id: post._id,
        user: post.authorName,
        avatar: post.avatar,
        time: new Date(post.createdAt).toLocaleString(),
        content: post.content,
        media: post.mediaUrl,
        mediaType: post.mediaType,
        userId: post.userId,
      });

      // Reset form
      setPostContent("");
      setPostMedia(null);
      setMediaType("");
    } catch (err) {
      console.error("❌ Error posting:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-input-wrapper">
      <form className="post-input-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <input type="file" accept="image/*,audio/*,video/*" onChange={handleMediaChange} />

        {/* Media Preview */}
        {postMedia && mediaType === "image" && (
          <img src={URL.createObjectURL(postMedia)} alt="preview" className="media-preview" />
        )}
        {postMedia && mediaType === "audio" && (
          <audio controls src={URL.createObjectURL(postMedia)} className="media-preview" />
        )}
        {postMedia && mediaType === "video" && (
          <video controls src={URL.createObjectURL(postMedia)} className="media-preview" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}

export default PostInput;

