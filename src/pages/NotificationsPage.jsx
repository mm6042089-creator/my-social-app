import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Heart, MessageSquare, UserPlus, Share2, CheckCheck } from "lucide-react";
import Avatar from "../components/Avatar";
import { EmptyState, ErrorState } from "../components/Feedback";
import { useNotifications } from "../hooks/useNotifications";
import { cx, timeAgo } from "../utils/helpers";

const ICONS = {
  like: Heart,
  comment: MessageSquare,
  follow: UserPlus,
  share: Share2,
};

function iconFor(type) {
  return ICONS[type] || Bell;
}

function messageFor(n) {
  if (n.message) return n.message;
  const name = n.from?.name || "Someone";
  switch (n.type) {
    case "like":
      return `${name} liked your post.`;
    case "comment":
      return `${name} commented on your post.`;
    case "follow":
      return `${name} started following you.`;
    case "share":
      return `${name} shared your post.`;
    default:
      return `${name} interacted with your activity.`;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, error, refresh, markRead, markAllRead } = useNotifications();

  function handleOpen(n) {
    if (!n.isRead) markRead(n.id);
    if (n.postId) navigate(`/posts/${n.postId}`);
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <div className="page-header-row">
          <h2 className="page-title">Notifications</h2>
          {unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div className="card notifications-card">
          {loading ? (
            <div className="skel skel-line" style={{ width: "60%" }} />
          ) : error ? (
            <ErrorState subtitle={error} onRetry={refresh} />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={<Bell size={24} />}
              title="No new notifications"
              subtitle="Likes, comments and follows will show up here."
            />
          ) : (
            <ul className="notification-list">
              {notifications.map((n) => {
                const Icon = iconFor(n.type);
                return (
                  <li key={n.id}>
                    <button
                      className={cx("notification-item", !n.isRead && "notification-item-unread")}
                      onClick={() => handleOpen(n)}
                    >
                      <div className="notification-avatar">
                        {n.from ? <Avatar user={n.from} size={40} /> : <Icon size={18} />}
                        <span className="notification-badge-icon"><Icon size={12} /></span>
                      </div>
                      <div className="notification-body">
                        <p>{messageFor(n)}</p>
                        <span className="notification-time">{timeAgo(n.createdAt)}</span>
                      </div>
                      {!n.isRead && <span className="notification-dot" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
