import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Compass, Bell, MessageCircle, User, KeyRound, Bookmark,
  Plus, Sun, Moon, X, LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import { useUnreadCount } from "../hooks/useNotifications";
import { cx } from "../utils/helpers";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: Home, end: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: true },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/saved", label: "Saved Posts", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/change-password", label: "Change Password", icon: KeyRound },
];

export default function Sidebar({ mobileOpen, closeMobile }) {
  const { theme, toggleTheme } = useTheme();
const { user, logout } = useAuth();
  const { count: unreadCount } = useUnreadCount();
  const navigate = useNavigate();
function handleLogout() {
  logout();
  toast("Signed out.");
  navigate("/login");
  closeMobile();
}
  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={closeMobile} />}
      <aside className={cx("sidebar", mobileOpen && "sidebar-open")}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn sidebar-close" onClick={closeMobile} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobile}
              className={({ isActive }) => cx("nav-item", isActive && "nav-item-active")}
            >
              <Icon size={20} />
              <span>{label}</span>
              {badge && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button className="btn btn-primary btn-block create-post-btn" onClick={() => { navigate("/create-post"); closeMobile(); }}>
          <Plus size={18} /> Create Post
        </button>

     <div className="sidebar-bottom">
  <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
    {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
  </button>
  <button className="nav-item" onClick={handleLogout}>
    <LogOut size={20} />
    <span>Log out</span>
  </button>
  <button className="mini-profile" onClick={() => { navigate("/profile"); closeMobile(); }}>
    <Avatar user={user} size={38} />
    <div>
      <div className="mini-profile-name">{user?.name}</div>
      <div className="mini-profile-handle">{user?.email}</div>
    </div>
  </button>
</div>
      </aside>
    </>
  );
}
