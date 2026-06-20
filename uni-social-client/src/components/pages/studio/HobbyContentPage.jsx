import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/HobbyContent.css";


const contentData = {
  music: [
    { title: "Piano Melody", audio: "/assets/music/piano.mp3" },
    { title: "Guitar Jam", audio: "/assets/music/guitar.mp3" },
    { title: "Violin Solo", audio: "/assets/music/violin.mp3" },
  ],
  literature: [
    { title: "Poetry", text: "The woods are lovely, dark and deep..." },
    { title: "Novel Excerpt", text: "It was the best of times, it was the worst of times..." },
    { title: "Short Story", text: "Once upon a time in a small village..." },
  ],
  sports: [
    { title: "Football Highlights", video: "/assets/sports/football.mp4" },
    { title: "Basketball Dunk", video: "/assets/sports/basketball.mp4" },
    { title: "Tennis Rally", video: "/assets/sports/tennis.mp4" },
  ],
  photography: [
    { title: "Sunset", image: "/assets/photography/sunset.jpg" },
    { title: "Mountains", image: "/assets/photography/mountains.jpg" },
  ],
  painting: [
    { title: "Abstract Art", image: "/assets/painting/abstract.jpg" },
    { title: "Landscape", image: "/assets/painting/landscape.jpg" },
  ],
  gaming: [
    { title: "Game Screenshot", image: "/assets/gaming/game1.jpg" },
    { title: "E-Sports", video: "/assets/gaming/esports.mp4" },
  ],
  travel: [
    { title: "Beach View", image: "/assets/travel/beach.jpg" },
    { title: "City Night", image: "/assets/travel/city.jpg" },
  ],
  cooking: [
    { title: "Pasta Recipe", image: "/assets/cooking/pasta.jpg" },
    { title: "Dessert Special", image: "/assets/cooking/dessert.jpg" },
  ],
  coding: [
    { title: "JavaScript Snippet", text: "console.log('Hello World');" },
    { title: "React Hook Example", text: "useEffect(() => {}, []);" },
  ],
  fashion: [
    { title: "Street Style", image: "/assets/fashion/street.jpg" },
    { title: "Runway", image: "/assets/fashion/runway.jpg" },
  ],
};

export default function HobbyContentPage() {
  const { hobby } = useParams();
  const navigate = useNavigate();
  const contentList = contentData[hobby] || [];
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="hobby-page">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/studio")}>
        ← Back to Studio
      </button>

      <h1>{hobby.charAt(0).toUpperCase() + hobby.slice(1)}</h1>

      <div className="hobby-content-grid">
        {contentList.map((item, idx) => (
          <div
            className="hobby-content-card"
            key={idx}
            onClick={() => setSelectedItem(item)}
          >
            {item.image && <img src={item.image} alt={item.title} />}
            {item.audio && <p>🎵 {item.title}</p>}
            {item.video && <p>🎥 {item.title}</p>}
            {item.text && <p>📖 {item.title}</p>}
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setSelectedItem(null)}>
              &times;
            </span>
            <h2>{selectedItem.title}</h2>

            {selectedItem.image && (
              <img src={selectedItem.image} alt={selectedItem.title} />
            )}
            {selectedItem.audio && (
              <audio controls autoPlay>
                <source src={selectedItem.audio} type="audio/mpeg" />
              </audio>
            )}
            {selectedItem.video && (
              <video controls width="100%" autoPlay>
                <source src={selectedItem.video} type="video/mp4" />
              </video>
            )}
            {selectedItem.text && <p className="hobby-text">{selectedItem.text}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
