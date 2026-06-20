import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext, DataProvider } from "../../context/DataContext";

import CreateGroupModal from "../common/CreateGroupModal";
import "../../styles/MoodRoomsPage.css";

export default function MoodRoomsPage({ currentUserId }) {
  const { groups, joinGroup } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Join group and redirect to group page
  const handleJoinGroup = (groupId) => {
    joinGroup(groupId, currentUserId);
    navigate(`/room/${groupId}`);
  };

  // Enter group page if already a member
  const handleEnterGroup = (groupId) => {
    navigate(`/room/${groupId}`);
  };

  return (
    <div className="mood-rooms-page">
      {/* Header */}
      <div className="mood-header">
        <h2>Hobby & Mood Rooms</h2>
        <button
          className="create-group-btn"
          onClick={() => setShowModal(true)}
        >
          + Create New Group
        </button>
      </div>

      {/* Modal for creating group */}
      {showModal && (
        <CreateGroupModal
          closeModal={() => setShowModal(false)}
          currentUserId={currentUserId}
        />
      )}

      {/* Group cards */}
      <div className="groups-list">
        {groups.map((group) => {
          const isMember = group.members.includes(currentUserId);

          return (
            <div
              key={group.id}
              className={`group-card ${isMember ? "member" : ""}`}
            >
              <h3>{group.name}</h3>
              <p><strong>Hobby:</strong> {group.hobby}</p>
              <p><strong>Members:</strong> {group.members.length}</p>

              {isMember ? (
                <button
                  className="go-btn"
                  onClick={() => handleEnterGroup(group.id)}
                >
                  Enter Group
                </button>
              ) : (
                <button
                  className="join-btn"
                  onClick={() => handleJoinGroup(group.id)}
                >
                  Join Group
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
