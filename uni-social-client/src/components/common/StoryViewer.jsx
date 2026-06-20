import React from "react";
import "../../styles/StoryViewer.css";


function StoryViewer({ story, onClose }) {
  if (!story) return null;

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-viewer-content" onClick={(e) => e.stopPropagation()}>
        <h3>{story.name}</h3>
        {story.mediaType === "image" && <img src={story.media} alt="story" />}
        {story.mediaType === "video" && <video src={story.media} controls autoPlay />}
        {story.mediaType === "audio" && <audio src={story.media} controls autoPlay />}
      </div>
    </div>
  );
}

export default StoryViewer;

