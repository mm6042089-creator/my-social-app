import { useState, useEffect, useCallback } from "react";
import * as notificationsApi from "../api/notifications/notifications.api";

/** Loads the notifications list and tracks the unread badge count. */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [{ notifications: list }, count] = await Promise.all([
        notificationsApi.getNotifications({ limit: 30 }),
        notificationsApi.getUnreadCount().catch(() => 0),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const markRead = useCallback(async (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationsApi.markNotificationRead(notificationId);
    } catch {
  
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationsApi.markAllNotificationsRead();
    } catch {
  
    }
  }, []);

  return { notifications, unreadCount, loading, error, refresh: fetchAll, markRead, markAllRead };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    notificationsApi
      .getUnreadCount()
      .then(setCount)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { count, refresh };
}
