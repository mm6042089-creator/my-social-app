import { http, unwrap, unwrapWithMeta } from "../../config/api";
import { normalizeUser } from "../users/users.api";

/**
 * @param {any} raw
 * @returns {import('../../types/notification.types').AppNotification|null}
 */
export function normalizeNotification(raw) {
  if (!raw) return null;
  const from = raw.from || raw.sender || raw.actor || raw.user || null;
  const post = raw.post || raw.postId || null;
  return {
    id: raw._id || raw.id,
    type: raw.type || "activity",
    message: raw.message || raw.text || raw.content || null,
    from: from ? normalizeUser(from) : null,
    postId: (typeof post === "object" ? post?._id : post) || null,
    isRead: raw.isRead ?? raw.read ?? false,
    createdAt: raw.createdAt || raw.time || null,
  };
}

/** GET /notifications */
export async function getNotifications({ page = 1, limit = 20 } = {}) {
  const res = await http.get("/notifications", { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.notifications || [];
  return { notifications: list.map(normalizeNotification), meta };
}

/** GET /notifications/unread-count */
export async function getUnreadCount() {
  const res = await http.get("/notifications/unread-count");
  const data = unwrap(res);
  return typeof data === "number" ? data : data?.count ?? data?.unreadCount ?? 0;
}

/** PATCH /notifications/:notificationId/read */
export async function markNotificationRead(notificationId) {
  const res = await http.patch(`/notifications/${notificationId}/read`);
  return unwrap(res);
}

/** PATCH /notifications/read-all */
export async function markAllNotificationsRead() {
  const res = await http.patch("/notifications/read-all");
  return unwrap(res);
}
