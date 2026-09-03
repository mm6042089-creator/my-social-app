import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { timeAgo } from "../utils/helpers";

const DURATION = 5000;

/**
 * @param {{stories: import('../types/post.types').Post[], startIndex: number, onClose: () => void}} props
 */
export default function StoryViewer({ stories, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const current = stories[index];

  const goNext = useCallback(() => {
    setIndex((i) => {
      if (i >= stories.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
    setProgress(0);
  }, [stories.length, onClose]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;
    const start = Date.now() - progress * DURATION;
    const raf = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / DURATION);
      setProgress(pct);
      if (pct >= 1) goNext();
    }, 30);
    return () => clearInterval(raf);

  }, [index, paused]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goNext, goPrev]);

  if (!current) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="story-viewer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="story-viewer-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
        >
          <div className="story-progress-row">
            {stories.map((_, i) => (
              <div key={i} className="story-progress-track">
                <div
                  className="story-progress-fill"
                  style={{ width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%" }}
                />
              </div>
            ))}
          </div>

          <div className="story-viewer-head">
            <Avatar user={current.author} size={32} />
            <span className="story-viewer-name">{current.author?.name}</span>
            <span className="story-viewer-time">{timeAgo(current.createdAt)}</span>
            <button className="icon-btn story-viewer-close" onClick={onClose} aria-label="Close story">
              <X size={18} />
            </button>
          </div>

          <img src={current.image} alt="" className="story-viewer-image" />

          {current.body && <div className="story-viewer-caption">{current.body}</div>}

          <button className="story-nav story-nav-left" onClick={goPrev} aria-label="Previous story">
            <ChevronLeft size={22} />
          </button>
          <button className="story-nav story-nav-right" onClick={goNext} aria-label="Next story">
            <ChevronRight size={22} />
          </button>

          <button
            className="btn btn-secondary btn-sm story-view-post-btn"
            onClick={() => { onClose(); navigate(`/posts/${current.id}`); }}
          >
            View full post
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
