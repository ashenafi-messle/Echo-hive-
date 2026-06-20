import React, { useState, useEffect, useContext } from "react";
import PostCard from "../common/PostCard";
import PostInput from "../common/PostInput";
import StoryModal from "../common/StoryModal";
import "../../styles/HomePage.css";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function HomePage() {
  const { user: currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [isAddStory, setIsAddStory] = useState(false);

  // Fetch posts and stories
  useEffect(() => {
    const fetchPostsAndStories = async () => {
      try {
        const res = await api.get("/posts");
        const validPosts = res.data.posts.filter((p) => p && p._id);

        const fetchedPosts = validPosts.map((p) => ({
          _id: p._id,
          user: p.authorName,
          avatar: p.avatar,
          time: new Date(p.createdAt).toLocaleString(),
          content: p.content || "",
          media: p.mediaUrl,
          mediaType: p.mediaType,
          userId: p.userId,
          createdAt: p.createdAt,
        }));

        // Sort newest first
        fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(fetchedPosts);

        // Stories = posts with media only
        const fetchedStories = fetchedPosts
          .filter((p) => p.media)
          .map((p) => ({
            id: p._id,
            name: p.user,
            avatar: p.avatar,
            media: p.media,
            mediaType: p.mediaType,
          }));

        setStories(fetchedStories);
      } catch (err) {
        console.error("❌ Error fetching posts:", err.response?.data || err.message);
      }
    };

    fetchPostsAndStories();
  }, []);

  // Handlers for posts
  const handleAddPost = (newPost) => {
    const normalized = {
      _id: newPost._id,
      user: newPost.authorName || newPost.user,
      avatar: newPost.avatar,
      time: new Date(newPost.createdAt).toLocaleString(),
      content: newPost.content || "",
      media: newPost.mediaUrl,
      mediaType: newPost.mediaType,
      userId: newPost.userId,
      createdAt: newPost.createdAt,
    };
    setPosts((prev) => [normalized, ...prev]);
  };

  const handleEditPost = (updatedPost) =>
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setStories((prev) => prev.filter((s) => s.id !== postId));
    } catch (err) {
      console.error("❌ Error deleting post:", err.response?.data || err.message);
      alert("Failed to delete post.");
    }
  };

  // Handlers for stories
  const handleAddStory = (newStory) => {
    const storyWithId = {
      ...newStory,
      id: newStory._id || Date.now().toString(),
    };
    setStories((prev) => [storyWithId, ...prev]);
  };

  return (
    <div className="home-page">
      {/* Stories row */}
      <div className="stories-feed">
        {/* Add Story */}
        <div
          key="add-story"
          className="story add-story"
          onClick={() => setIsAddStory(true)}
        >
          <span className="add-icon">➕</span>
          <span>Add</span>
        </div>

        {/* Render existing stories */}
        {stories.map((story) => (
          <div
            key={story.id}
            className="story-item"
            onClick={() => setSelectedStoryId(story.id)}
          >
            <img src={story.avatar} alt={story.name} />
            <span>{story.name}</span>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {(selectedStoryId || isAddStory) && (
        <StoryModal
          storyId={selectedStoryId}
          onClose={() => {
            setSelectedStoryId(null);
            setIsAddStory(false);
          }}
          onAddStory={handleAddStory}
        />
      )}

      {/* Post Input & Feed */}
      <div className="feed-container">
        <PostInput onPost={handleAddPost} />

        {posts.map((post) =>
          post ? (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ) : null
        )}
      </div>
    </div>
  );
}





