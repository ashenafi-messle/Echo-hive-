import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Settings.css";
import { ThemeContext } from "../common/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

export default function SettingsPage() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ← React Router navigation

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: true,
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Username: ${username}\nPassword: ${password}\nTheme: ${theme}\nSocial: ${JSON.stringify(
        socialLinks
      )}\nNotifications: ${JSON.stringify(notifications)}\nPrivacy: ${JSON.stringify(
        privacy
      )}`
    );
  };

  const handleAddAccount = () => {
    logout(); // Optional: log out current user
    navigate("/login"); // ← Redirect to login page
  };

  return (
    <div className="settings-main">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Account Section */}
        <section className="settings-section">
          <h3>Account</h3>
          <label>
            Username:
            <input
              type="text"
              placeholder="Change username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </section>

        {/* Theme Section */}
        <section className="settings-section">
          <h3>Theme</h3>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="theme-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>

        {/* Social Media Section */}
        <section className="settings-section">
          <h3>Social Media Accounts</h3>
          {Object.keys(socialLinks).map((key) => (
            <label key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
              <input
                type="text"
                placeholder={`Add your ${key} link`}
                value={socialLinks[key]}
                onChange={(e) =>
                  setSocialLinks({ ...socialLinks, [key]: e.target.value })
                }
              />
            </label>
          ))}
        </section>

        {/* Notifications Section */}
        <section className="settings-section">
          <h3>Notifications</h3>
          {Object.keys(notifications).map((key) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() =>
                  setNotifications({ ...notifications, [key]: !notifications[key] })
                }
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </section>

        {/* Privacy Section */}
        <section className="settings-section">
          <h3>Privacy</h3>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={privacy.profilePublic}
              onChange={() =>
                setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })
              }
            />
            Public Profile
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={privacy.showActivity}
              onChange={() =>
                setPrivacy({ ...privacy, showActivity: !privacy.showActivity })
              }
            />
            Show Activity Status
          </label>
        </section>

        {/* Delete Account Section */}
        <section className="settings-section delete-section">
          <h3>Delete Account</h3>
          <p>
            Warning: This action is irreversible. Your profile and all posts
            will be permanently deleted.
          </p>
          <button
            type="button"
            className="delete-btn"
            onClick={() => alert("Account Deleted")}
          >
            Delete My Account
          </button>
        </section>

        {/* Logout & Add Account Section */}
        <section className="settings-section logout-section">
          <button type="button" className="logout-btn" onClick={logout}>
            Logout
          </button>
          <button
            type="button"
            className="add-account-btn"
            onClick={handleAddAccount}
          >
            Add Another Account
          </button>
        </section>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
