import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { AuthContext } from "./context/AuthContext";

import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import HomePage from "./components/pages/HomePage";
import ChatPage from "./components/pages/ChatPage";
import NotificationsPage from "./components/pages/NotificationsPage";
import ProfilePage from "./components/pages/ProfilePage";
import ExplorePage from "./components/pages/ExplorePage";
import PeoplePage from "./components/pages/PeoplePage";
import SettingsPage from "./components/pages/SettingsPage";
import EditProfilePage from "./components/common/EditProfilePage";
import MoodRoomsPage from "./components/pages/MoodRoomsPage";
import GroupRoomPage from "./components/pages/GroupRoomPage";
import Layout from "./components/common/Layout";


// 🔹 New imports
import StudioPage from "./components/pages/studio/StudioPage";
import HobbyContentPage from "./components/pages/studio/HobbyContentPage";


function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Layout><HomePage /></Layout></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Layout><ChatPage /></Layout></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Layout><NotificationsPage /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />
        <Route path="/explore" element={<PrivateRoute><Layout><ExplorePage /></Layout></PrivateRoute>} />
        <Route path="/people" element={<PrivateRoute><Layout><PeoplePage /></Layout></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Layout><SettingsPage /></Layout></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><Layout><EditProfilePage /></Layout></PrivateRoute>} />

        {/* Hobby/Mood Rooms */}
        <Route 
          path="/rooms" 
          element={
            <PrivateRoute>
              <Layout>
                {user && <MoodRoomsPage currentUserId={user.id} />}
              </Layout>
            </PrivateRoute>
          } 
        />

        {/* Group Room page */}
        <Route 
          path="/room/:id" 
          element={
            <PrivateRoute>
              <Layout>
                {user && <GroupRoomPage currentUserId={user.id} />}
              </Layout>
            </PrivateRoute>
          } 
        />

        {/* 🔹 New Studio routes */}
        <Route
          path="/studio"
          element={
            <PrivateRoute>
              <Layout>
                <StudioPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/studio/:hobby"
          element={
            <PrivateRoute>
              <Layout>
                <HobbyContentPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
