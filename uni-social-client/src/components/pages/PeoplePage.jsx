import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "../../styles/PeoplePage.css";

export default function PeoplePage() {
  const currentUserId = 1; // Replace with AuthContext user.id
  const { users, sendFollowRequest, acceptFollowRequest } = useContext(DataContext);
  const currentUser = users.find(u => u.id === currentUserId);

  return (
    <div className="people-list">
      <h2>Follow Requests</h2>
      {currentUser.requests.length === 0 && <p>No requests.</p>}
      {currentUser.requests.map(requesterId => {
        const requester = users.find(u => u.id === requesterId);
        return (
          <div key={requesterId} className="person">
            <span>{requester.name} (@{requester.username})</span>
            <button onClick={() => acceptFollowRequest(currentUserId, requesterId)}>
              Accept
            </button>
          </div>
        );
      })}

      <h2>Find People</h2>
      {users
        .filter(u => u.id !== currentUserId)
        .map(u => {
          const alreadyRequested = u.requests.includes(currentUserId);
          const alreadyFollowing = u.followers.includes(currentUserId);

          return (
            <div key={u.id} className="person">
              <span>{u.name} (@{u.username})</span>
              <button
                disabled={alreadyRequested || alreadyFollowing}
                onClick={() => sendFollowRequest(currentUserId, u.id)}
              >
                {alreadyFollowing ? "Following" : alreadyRequested ? "Requested" : "Follow"}
              </button>
            </div>
          );
        })}
    </div>
  );
}
