import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Plus, Bell, User } from "lucide-react";
import { useUnreadCount } from "../hooks/useNotifications";
import { cx } from "../utils/helpers";

export default function MobileTabBar() {
  const navigate = useNavigate();
  const { count: unreadCount } = useUnreadCount();
  return (
    <nav className="mobile-tabbar">
      <NavLink to="/home" end className={({ isActive }) => cx(isActive && "active")} aria-label="Home">
        <Home size={21} />
      </NavLink>
      <NavLink to="/explore" className={({ isActive }) => cx(isActive && "active")} aria-label="Explore">
        <Compass size={21} />
      </NavLink>
      <button className="mobile-tabbar-fab" onClick={() => navigate("/create-post")} aria-label="Create post">
        <Plus size={22} />
      </button>
      <NavLink to="/notifications" className={({ isActive }) => cx(isActive && "active")} aria-label="Notifications" style={{ position: "relative" }}>
        <Bell size={21} />
        {unreadCount > 0 && <span className="dot-badge" style={{ top: 2, right: 2 }} />}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => cx(isActive && "active")} aria-label="Profile">
        <User size={21} />
      </NavLink>
    </nav>
  );
}
