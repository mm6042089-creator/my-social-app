import React, { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "../components/PostCard";
import { PostSkeleton, EmptyState, ErrorState } from "../components/Feedback";
import { getBookmarks, deletePost, toggleLike, toggleBookmark } from "../api/posts/posts.api";

export default function SavedPostsPage() {
  const { requestDelete } = useOutletContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts: list } = await getBookmarks({ limit: 30 });
      setPosts(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleBookmark(postId) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await toggleBookmark(postId);
    } catch {
      load();
    }
  }

  async function handleToggleLike(postId) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) } : p
      )
    );
    try {
      await toggleLike(postId);
    } catch {
      load();
    }
  }

  function handleDelete(post) {
    requestDelete("post", async () => {
      try {
        await deletePost(post.id);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        toast.success("Post deleted.");
      } catch (err) {
        toast.error(err.message || "Couldn't delete the post.");
        throw err;
      }
    });
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <h2 className="page-title">Saved Posts</h2>

        {loading ? (
          <>
            <PostSkeleton /><PostSkeleton />
          </>
        ) : error ? (
          <ErrorState subtitle={error} onRetry={load} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={24} />}
            title="Nothing saved yet"
            subtitle="Tap the bookmark icon on any post to save it for later."
          />
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onDelete={handleDelete}
            />
          ))
        )}
      </main>
    </div>
  );
}
