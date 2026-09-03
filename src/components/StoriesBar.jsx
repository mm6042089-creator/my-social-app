import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import StoryViewer from "./StoryViewer";
import { useAuth } from "../hooks/useAuth";

/**
 * @param {{posts: import('../types/post.types').Post[]}} props
 */
export default function StoriesBar({ posts }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const seen = new Set();
  const stories = [];
  for (const post of posts) {
    if (!post.image || !post.author?._id) continue;
    if (seen.has(post.author._id)) continue;
    seen.add(post.author._id);
    stories.push(post);
  }

  if (stories.length === 0 && !user) return null;

  return (
    <>
      <div className="stories-row">
        <button className="story-item" onClick={() => navigate("/create-post")}>
          <div className="story-avatar-frame story-avatar-frame-self">
            <Avatar user={user} size={68} />
            <span className="story-add-badge"><Plus size={13} /></span>
          </div>
          <span className="story-label">Your Story</span>
        </button>

        {stories.map((post, i) => (
          <button key={post.author._id} className="story-item" onClick={() => setActiveIndex(i)}>
            <div className="story-avatar-frame">
              <div className="story-ring" />
              <img src={post.author.photo || post.image} alt={post.author.name} className="story-avatar-img" />
            </div>
            <span className="story-label">{post.author.name?.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
        />
      )}
    </>
  );
}
