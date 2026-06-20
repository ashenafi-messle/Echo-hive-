import React, { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "../../styles/NotificationsPage.css";

export default function NotificationsPage() {
  const { notifications } = useContext(DataContext);

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>You have no notifications</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note, index) => (
            <li key={index} className="notification-item">
              <div className="notification-user">{note.user}</div>
              <div className="notification-action">{note.action}</div>
              <div className="notification-time">{new Date(note.time).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

