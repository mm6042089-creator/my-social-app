import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MoreHorizontal, Heart, MessageSquare, Share2, Bookmark, Edit2, Trash2,
  AlertCircle, EyeOff,
} from "lucide-react";
import Avatar, { VerifiedBadge } from "./Avatar";
import { useAuth } from "../hooks/useAuth";
import { cx } from "../utils/helpers";
import { timeAgo } from "../utils/helpers";

export default function PostCard({ post, onToggleLike, onToggleBookmark, onDelete }) {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [burst, setBurst] = useState(false);
  const lastTap = useRef(0);
  const author = post.author || {};
  const mine = me && author && author._id === me._id;

  function handleImageTap() {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!post.isLiked) onToggleLike(post.id);
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (Date.now() - lastTap.current >= 300) navigate(`/posts/${post.id}`);
      }, 300);
    }
  }

  return (
    <article className="card post-card">
      <div className="post-head">
        <button className="post-head-user" onClick={() => navigate(`/posts/${post.id}`)}>
          <Avatar user={author} size={44} accent />
          <div>
            <div className="post-name-row">
              <span className="post-name">{author.name}</span>
            </div>
            <div className="post-meta">{timeAgo(post.createdAt)}</div>
          </div>
        </button>

        <div className="post-menu-wrap">
          <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Post options">
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="post-menu" onMouseLeave={() => setMenuOpen(false)}>
              {mine ? (
                <>
                  <button onClick={() => { setMenuOpen(false); navigate(`/edit-post/${post.id}`); }}><Edit2 size={14} /> Edit post</button>
                  <button className="danger" onClick={() => { setMenuOpen(false); onDelete(post); }}><Trash2 size={14} /> Delete post</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMenuOpen(false); toast("Post reported to the Maiven team."); }}><AlertCircle size={14} /> Report</button>
                  <button onClick={() => { setMenuOpen(false); toast(`You've muted ${author.name}.`); }}><EyeOff size={14} /> Mute {author.name}</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="post-text" onClick={() => navigate(`/posts/${post.id}`)}>{post.body}</p>

      {post.image && (
        <div className="post-image-wrap" onClick={handleImageTap}>
          <img src={post.image} alt="Post attachment" className="post-image" loading="lazy" />
          <AnimatePresence>
            {burst && (
              <motion.div
                className="like-burst"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1.15, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <Heart size={84} fill="#fff" color="#fff" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="post-actions">
        <motion.button
          whileTap={{ scale: 0.8 }}
          animate={post.isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.32 }}
          className={cx("post-action", post.isLiked && "post-action-active")}
          onClick={() => onToggleLike(post.id)}
        >
          <Heart size={19} fill={post.isLiked ? "currentColor" : "none"} /> {post.likesCount}
        </motion.button>
        <button className="post-action" onClick={() => navigate(`/posts/${post.id}`)}>
          <MessageSquare size={19} /> {post.commentsCount}
        </button>
        <button className="post-action" onClick={() => toast.success("Share link copied to clipboard.")}>
          <Share2 size={19} />
        </button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className={cx("post-action", "post-action-save", post.isBookmarked && "post-action-active")}
          onClick={() => onToggleBookmark(post.id)}
        >
          <Bookmark size={19} fill={post.isBookmarked ? "currentColor" : "none"} />
        </motion.button>
      </div>

      {post.commentsCount > 0 && (
        <button className="post-view-comments" onClick={() => navigate(`/posts/${post.id}`)}>
          View all {post.commentsCount} comments
        </button>
      )}
    </article>
  );
}
