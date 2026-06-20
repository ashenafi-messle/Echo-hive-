import React, { useState } from "react";
import "../../styles/Explore.css";
import { FaSearch } from "react-icons/fa";

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  // Example trending topics
  const trendingTopics = ["#FreshersWeek", "#ExamTips", "#SportsDay", "#CodingChallenge", "#MusicLovers", "#TravelGoals"];

  // Filter topics based on search
  const filteredTopics = trendingTopics.filter((topic) =>
    topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="explore-main">
      <h2>Explore</h2>

      {/* Search bar */}
      <div className="explore-search">
        <input
          type="text"
          placeholder="Search topics or users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      {/* Trending topics */}
      <div className="explore-trending">
        <h3>Trending Topics</h3>
        <div className="trending-list">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
              <button key={index} className="topic-btn">
                {topic}
              </button>
            ))
          ) : (
            <p className="no-results">No topics found.</p>
          )}
        </div>
      </div>
    </div>
  );
}


