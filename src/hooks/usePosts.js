import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import * as postsApi from "../api/posts/posts.api";

export function usePosts({ only = "all", limit = 10 } = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchPage = useCallback(
    async (pageNum, { append } = {}) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);
      try {
        const { posts: list, meta } = await postsApi.getFeed({ only, page: pageNum, limit });
        if (!mounted.current) return;
        setPosts((prev) => (append ? [...prev, ...list] : list));
        setPage(pageNum);
        const totalPages = meta?.totalPages ?? meta?.pages;
        setHasMore(totalPages ? pageNum < totalPages : list.length === limit);
      } catch (err) {
        if (mounted.current) setError(err.message);
      } finally {
        if (mounted.current) {
          append ? setLoadingMore(false) : setLoading(false);
        }
      }
    },
    [only, limit]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const refresh = useCallback(() => fetchPage(1), [fetchPage]);
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchPage(page + 1, { append: true });
  }, [fetchPage, page, hasMore, loadingMore]);

  const createPost = useCallback(async (values) => {
    const newPost = await postsApi.createPost(values);
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Post published to your feed.");
    return newPost;
  }, []);

  const editPost = useCallback(async (postId, values) => {
    const updated = await postsApi.updatePost(postId, values);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    toast.success("Post updated.");
    return updated;
  }, []);

  const removePost = useCallback(async (postId) => {
    try {
      await postsApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted.");
    } catch (err) {
      toast.error(err.message || "Couldn't delete the post.");
      throw err;
    }
  }, []);

  const toggleLike = useCallback(async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) }
          : p
      )
    );
    try {
      await postsApi.toggleLike(postId);
    } catch (err) {
      // revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) }
            : p
        )
      );
      toast.error(err.message || "Couldn't update like.");
    }
  }, []);

  const toggleBookmark = useCallback(async (postId) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
    try {
      await postsApi.toggleBookmark(postId);
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
      );
      toast.error(err.message || "Couldn't update bookmark.");
    }
  }, []);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    createPost,
    editPost,
    removePost,
    toggleLike,
    toggleBookmark,
    setPosts,
  };
}

export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postsApi.getPostById(postId);
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const toggleLike = useCallback(async () => {
    setPost((p) => p && { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) });
    try {
      await postsApi.toggleLike(postId);
    } catch (err) {
      setPost((p) => p && { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) });
      toast.error(err.message || "Couldn't update like.");
    }
  }, [postId]);

  const toggleBookmark = useCallback(async () => {
    setPost((p) => p && { ...p, isBookmarked: !p.isBookmarked });
    try {
      await postsApi.toggleBookmark(postId);
    } catch (err) {
      setPost((p) => p && { ...p, isBookmarked: !p.isBookmarked });
      toast.error(err.message || "Couldn't update bookmark.");
    }
  }, [postId]);

  return { post, loading, error, refresh: fetchPost, toggleLike, toggleBookmark, setPost };
}
