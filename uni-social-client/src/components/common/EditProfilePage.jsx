// EditProfilePage.jsx
import React, { useState, useContext } from "react";
import "../../styles/EditProfile.css";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";

export default function EditProfilePage() {
  const { user: currentUser, login } = useContext(AuthContext);

  const [profilePic, setProfilePic] = useState(null); // file object
  const [preview, setPreview] = useState(
    currentUser.avatar || "https://via.placeholder.com/150"
  ); // preview URL
  const [name, setName] = useState(currentUser.fullName || "");
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [details, setDetails] = useState(currentUser.details || "");
  const [loading, setLoading] = useState(false);

  // Handle file selection & preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit updated profile to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("details", details);

      if (profilePic) {
        formData.append("avatar", profilePic); // attach file for Cloudinary
      }

      const res = await api.put(`/profile/${currentUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update AuthContext with new user info
      login({ ...currentUser, ...res.data.user });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-main">
      <h2>Edit Profile</h2>

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="form-group profile-pic-group">
          <img src={preview} alt="profile" className="profile-preview" />
          <label className="upload-btn">
            Change Profile Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Bio */}
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Details */}
        <div className="form-group">
          <label>Details</label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

