import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWifi, FaHome, FaComments, FaBell, FaSearch, FaBars } from "react-icons/fa";
import "../../styles/TopBar.css";

function TopBar() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarActive(!sidebarActive);

  return (
    <>
      {/* Overlay */}
      {sidebarActive && <div className="overlay" onClick={toggleSidebar}></div>}

      <div className="topbar">
        {/* Menu + Logo */}
        <div className="topbar-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <Link to="/" className="logo-link">
            <FaWifi className="wifi-logo" />
            <span className="logo-text">Echohive</span>
          </Link>
        </div>

        {/* Navigation icons */}
        <div className="topbar-center">
          <Link to="/" title="Home" className={`nav-icon ${location.pathname === "/" ? "active" : ""}`}><FaHome /></Link>
          <Link to="/chat" title="Chat" className={`nav-icon ${location.pathname === "/chat" ? "active" : ""}`}><FaComments /></Link>
          <Link to="/notifications" title="Notifications" className={`nav-icon ${location.pathname === "/notifications" ? "active" : ""}`}><FaBell /></Link>
          <Link to="/explore" title="Explore" className={`nav-icon ${location.pathname === "/explore" ? "active" : ""}`}><FaSearch /></Link>
        </div>

        {/* Profile button */}
        <div className="topbar-right">
          <Link to="/profile" className="profile-btn">My Profile</Link>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <h3>Menu</h3>
        <ul>
          <li><Link to="/" onClick={toggleSidebar}>🏠 Feed</Link></li>
          <li><Link to="/chat" onClick={toggleSidebar}>💬 Chat</Link></li>
          <li><Link to="/notifications" onClick={toggleSidebar}>🔔 Notifications</Link></li>
          <li><Link to="/explore" onClick={toggleSidebar}>🔍 Explore</Link></li>
          <li><Link to="/people" onClick={toggleSidebar}>👥 People</Link></li>
          <li><Link to="/settings" onClick={toggleSidebar}>⚙️ Settings</Link></li>
          <li><Link to="/rooms" onClick={toggleSidebar}>🎯 Groups</Link></li>
          <li><Link to="/studio" onClick={toggleSidebar}>🎨 Studio</Link></li>
        </ul>
      </div>
    </>
  );
}

export default TopBar;






