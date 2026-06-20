import React, { useState, useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "../../styles/CreateGroupModal.css";

export default function CreateGroupModal({ closeModal, currentUserId }) {
  const { createGroup } = useContext(DataContext);

  const [groupName, setGroupName] = useState("");
  const [hobby, setHobby] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName || !hobby) return alert("Please fill all fields");

    // Create the group
    const groupId = createGroup({ name: groupName, hobby, ownerId: currentUserId });

    alert(`Group "${groupName}" created!`);
    closeModal(); // Close modal
    setGroupName("");
    setHobby("");
  };

  return (
    <div className="create-group-modal">
      <div className="modal-content">
        <h2>Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Group Name:
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </label>

          <label>
            Hobby / Mood:
            <select value={hobby} onChange={(e) => setHobby(e.target.value)}>
              <option value="">Select Hobby/Mood</option>
              <option value="music">Music</option>
              <option value="movies">Movies</option>
              <option value="travel">Travel</option>
              <option value="gaming">Gaming</option>
              <option value="sports">Sports</option>
              <option value="art">Art</option>
              <option value="reading">Reading</option>
              <option value="coding">Coding</option>
            </select>
          </label>

          <div className="modal-buttons">
            <button type="submit">Create Group</button>
            <button type="button" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
