import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import PostCard from "../common/PostCard";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Profile.css";

export default function ProfilePage() {
  const { user: currentUser } = useContext(AuthContext); // logged-in user
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      console.error("No currentUser or currentUser.id is undefined");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for user ID:", currentUser.id);

        const resUser = await api.get(`/profile/${currentUser.id}`);
        setUser(resUser.data);

        const resPosts = await api.get(`/profile/${currentUser.id}/posts`);
        setPosts(resPosts.data.posts || []);
      } catch (err) {
        console.error("Error fetching profile:", err.response || err);
        alert(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found</p>;

  const handleAccept = async (requestId) => {
    try {
      await api.post(`/profile/${currentUser.id}/follow/accept`, { requestId });
      alert("Follow request accepted!");
      const resUser = await api.get(`/profile/${currentUser.id}`);
      setUser(resUser.data);
    } catch (err) {
      console.error("Accept error:", err.response || err);
      alert("Failed to accept request");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await api.post(`/profile/${currentUser.id}/follow/decline`, { requestId });
      alert("Follow request declined!");
      const resUser = await api.get(`/profile/${currentUser.id}`);
      setUser(resUser.data);
    } catch (err) {
      console.error("Decline error:", err.response || err);
      alert("Failed to decline request");
    }
  };

  return (
    <div className="profile-main">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="profile"
          />
        </div>
        <div className="profile-info">
          <h1>{user.fullName}</h1>
          <p className="username">@{user.username || user.fullName}</p>
          <p className="bio">{user.bio || "No bio provided."}</p>
          <p className="details">{user.details || ""}</p>

          <div className="profile-stats">
            <span>{user.followers?.length || 0} Followers</span> |{" "}
            <span>{user.following?.length || 0} Following</span>
          </div>

          <div className="profile-actions">
            <Link to="/edit-profile">
              <button className="edit-btn">Edit Profile</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Follow Requests */}
      {user.requests?.length > 0 && (
        <div className="follow-requests">
          <h3>Follow Requests</h3>
          {user.requests.map((reqId) => {
            const requester =
              user.requestsData?.find((u) => u._id === reqId) || {};
            return (
              <div key={reqId} className="request-item">
                <span>
                  {requester.fullName || "Unknown"} (@
                  {requester.username || requester.fullName || "Unknown"})
                </span>
                <div className="request-actions">
                  <button onClick={() => handleAccept(reqId)}>Accept</button>
                  <button onClick={() => handleDecline(reqId)}>Decline</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Posts */}
      <div className="profile-posts">
        <h2>My Posts</h2>
        {posts.map((post) => (
          <PostCard
            key={post._id}
            user={user.fullName}
            avatar={user.avatar || "https://via.placeholder.com/40"}
            time={post.createdAt}
            content={post.content}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
}

