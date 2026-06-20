import React, { createContext, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", username: "johndoe", followers: [], following: [], requests: [] },
    { id: 2, name: "Alice", username: "alice", followers: [], following: [], requests: [] },
    { id: 3, name: "Bob", username: "bob", followers: [], following: [], requests: [] },
  ]);

  const [groups, setGroups] = useState([
    { id: 1, name: "Music Lovers", hobby: "music", ownerId: 2, members: [2], posts: [], chat: [], announcements: [] },
    { id: 2, name: "Movie Buffs", hobby: "movies", ownerId: 3, members: [3], posts: [], chat: [], announcements: [] },
    { id: 3, name: "Travel Enthusiasts", hobby: "travel", ownerId: 1, members: [1], posts: [], chat: [], announcements: [] },
  ]);

  // --- Post / Notifications / Messages ---
  const addPost = (post) => setPosts([post, ...posts]);
  const addNotification = (note) => setNotifications([note, ...notifications]);
  const addMessage = (msg) => setMessages([...messages, msg]);

  // --- Follow System ---
  const sendFollowRequest = (fromUserId, toUserId) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === toUserId && !user.requests.includes(fromUserId)
          ? { ...user, requests: [...user.requests, fromUserId] }
          : user
      )
    );
  };

  const acceptFollowRequest = (userId, requesterId) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            followers: [...user.followers, requesterId],
            requests: user.requests.filter(id => id !== requesterId),
          };
        } else if (user.id === requesterId) {
          return { ...user, following: [...user.following, userId] };
        }
        return user;
      })
    );
  };

  const declineFollowRequest = (userId, requesterId) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, requests: user.requests.filter(id => id !== requesterId) }
          : user
      )
    );
  };

  // --- Group System ---
  const createGroup = ({ name, hobby, ownerId }) => {
    const newGroup = {
      id: groups.length + 1,
      name,
      hobby,
      ownerId,
      members: [ownerId],
      posts: [],
      chat: [],
      announcements: [],   // ✅ added safe default
    };
    setGroups([newGroup, ...groups]);
    return newGroup.id;
  };

  const joinGroup = (groupId, userId) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId && !group.members.includes(userId)
          ? { ...group, members: [...group.members, userId] }
          : group
      )
    );
  };

  const leaveGroup = (groupId, userId) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, members: group.members.filter(id => id !== userId) }
          : group
      )
    );
  };

  const postInGroup = (groupId, post) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, posts: [post, ...group.posts] }
          : group
      )
    );
  };

  const sendGroupMessage = (groupId, message) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, chat: [...group.chat, message] }
          : group
      )
    );
  };

  const addAnnouncement = (groupId, announcement) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, announcements: [...group.announcements, announcement] }
          : group
      )
    );
  };

  const removeGroupMember = (groupId, userId) => {
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, members: group.members.filter(id => id !== userId) }
          : group
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        // General
        posts,
        addPost,
        notifications,
        addNotification,
        messages,
        addMessage,
        users,
        sendFollowRequest,
        acceptFollowRequest,
        declineFollowRequest,

        // Groups
        groups,
        createGroup,
        joinGroup,
        leaveGroup,
        postInGroup,
        sendGroupMessage,
        addAnnouncement,
        removeGroupMember,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
