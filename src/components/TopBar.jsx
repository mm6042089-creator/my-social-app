import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";
import { useUnreadCount } from "../hooks/useNotifications";

export default function TopBar({ onMenu }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { count: unreadCount } = useUnreadCount();

  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={onMenu} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div className="topbar-search">
        <Search size={17} />
        <input
          name="search"
          id="topbar-search"
          type="search"
          placeholder="Search people and posts"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && q.trim() && toast(`Showing results for "${q.trim()}"`)}
        />
      </div>
      <div className="topbar-actions">
        <button className="icon-btn desktop-only" style={{ position: "relative" }} onClick={() => navigate("/notifications")} aria-label="Notifications">
          <Bell size={19} />
          {unreadCount > 0 && <span className="dot-badge" />}
        </button>
        <button className="icon-btn desktop-only" onClick={() => navigate("/messages")} aria-label="Messages">
          <MessageCircle size={19} />
        </button>
        <button className="topbar-avatar" onClick={() => navigate("/profile")} aria-label="Your profile">
          <Avatar user={user} size={36} accent />
        </button>
      </div>
    </header>
  );
}