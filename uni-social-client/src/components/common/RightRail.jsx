import React from "react";
import "../../styles/RightRail.css";

function RightRail() {
  const handleClick = (trend) => {
    alert(`You clicked ${trend}`);
  };

  return (
    <div className="right-rail">
      <h3>Trending</h3>
      <ul>
        <li onClick={() => handleClick("#React")}>#React</li>
        <li onClick={() => handleClick("#NodeJS")}>#NodeJS</li>
        <li onClick={() => handleClick("#Echohive")}>#Echohive</li>
        <li onClick={() => handleClick("#JavaScript")}>#JavaScript</li>
      </ul>
    </div>
  );
}

export default RightRail;


