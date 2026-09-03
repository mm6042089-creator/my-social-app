import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";
import * as commentsApi from "../api/comments/comments.api";

export function useComments(postId) {
    const { user: me } = useAuth(); 
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const { comments: list } = await commentsApi.getComments(postId, { limit: 50 });
      setComments(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

const addComment = useCallback(
  async (text) => {
    try {
      const comment = await commentsApi.createComment(postId, { text });
      const withAuthor = comment.author?._id ? comment : { ...comment, author: me };
      setComments((prev) => [...prev, withAuthor]);
      toast.success("Comment posted.");
      return withAuthor;
    } catch (err) {
      toast.error(err.message || "Couldn't post your comment.");
      throw err;
    }
  },
  [postId, me]   
);

const editComment = useCallback(
  async (commentId, text) => {
    try {
      const updated = await commentsApi.updateComment(postId, commentId, { text });
      const withAuthor = updated.author?._id ? updated : { ...updated, author: me };
      setComments((prev) => prev.map((c) => (c.id === commentId ? withAuthor : c)));
      toast.success("Comment updated.");
      return withAuthor;
    } catch (err) {
      toast.error(err.message || "Couldn't update your comment.");
      throw err;
    }
  },
  [postId, me]   
);

  const removeComment = useCallback(
    async (commentId) => {
      try {
        await commentsApi.deleteComment(postId, commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Comment deleted.");
      } catch (err) {
        toast.error(err.message || "Couldn't delete your comment.");
        throw err;
      }
    },
    [postId]
  );

  return { comments, loading, error, refresh: fetchComments, addComment, editComment, removeComment };
}
