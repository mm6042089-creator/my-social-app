import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";
import FullScreenLoader from "../components/FullScreenLoader";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";
import PostDetailsPage from "../pages/PostDetailsPage";
import ProfilePage from "../pages/ProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import EditPostPage from "../pages/EditPostPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import NotificationsPage from "../pages/NotificationsPage";
import SavedPostsPage from "../pages/SavedPostsPage";
import PlaceholderPage from "../pages/PlaceholderPage";
import { Compass, MessageCircle } from "lucide-react";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) return <FullScreenLoader />;
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

export default function AppRoutes() {
  const { authLoading } = useAuth();

  return (
    <Routes>
      {/* ---- Public routes ---- */}
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      {/* ---- Protected routes ---- */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/saved" element={<SavedPostsPage />} />

        <Route
          path="/explore"
          element={<PlaceholderPage icon={<Compass size={24} />} title="Explore is warming up" subtitle="Discover posts and creators outside your circle, coming soon." />}
        />
        <Route
          path="/messages"
          element={<PlaceholderPage icon={<MessageCircle size={24} />} title="No conversations yet" subtitle="Messages from people you follow will appear here." />}
        />
      </Route>

      <Route
        path="/"
        element={authLoading ? <FullScreenLoader /> : <Navigate to="/home" replace />}
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
