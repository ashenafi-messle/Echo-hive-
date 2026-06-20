import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Studio.css";


const hobbies = [
  { name: "Music", route: "music", desc: "Listen & share your favorite tracks", icon: "🎵" },
  { name: "Literature", route: "literature", desc: "Explore poems, stories & books", icon: "📚" },
  { name: "Sports", route: "sports", desc: "Stay updated & discuss matches", icon: "⚽" },
  { name: "Photography", route: "photography", desc: "Showcase your best shots", icon: "📸" },
  { name: "Painting", route: "painting", desc: "Share paintings & creative works", icon: "🎨" },
  { name: "Gaming", route: "gaming", desc: "Talk about your favorite games", icon: "🎮" },
  { name: "Cooking", route: "cooking", desc: "Recipes & food adventures", icon: "🍳" },
  { name: "Fitness", route: "fitness", desc: "Workout tips & motivation", icon: "💪" },
  { name: "Travel", route: "travel", desc: "Share your journeys & tips", icon: "✈️" },
  { name: "Tech", route: "tech", desc: "Discuss coding & innovations", icon: "💻" },
];

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <div className="studio-container">
      <h1 className="studio-title">🎨 Hobby Studio</h1>
      <p className="studio-subtitle">Pick a hobby and dive into its world</p>

      <div className="hobby-grid">
        {hobbies.map((hobby) => (
          <div
            key={hobby.route}
            className="hobby-card"
            onClick={() => navigate(`/studio/${hobby.route}`)}
          >
            <div className="hobby-icon">{hobby.icon}</div>
            <h2 className="hobby-name">{hobby.name}</h2>
            <p className="hobby-desc">{hobby.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
