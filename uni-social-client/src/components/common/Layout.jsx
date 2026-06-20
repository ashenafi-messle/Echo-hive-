import React from "react";
import "../../styles/Layout.css";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      {/* TopBar is always static */}
      <TopBar />

      {/* Main content */}
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
}
