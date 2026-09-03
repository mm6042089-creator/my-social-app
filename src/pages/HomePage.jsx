import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Inbox, Plus, ChevronDown } from "lucide-react";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import RightSidebar from "../components/RightSidebar";
import { PostSkeleton, EmptyState, ErrorState } from "../components/Feedback";
import { usePosts } from "../hooks/usePosts";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { requestDelete } = useOutletContext();
  const {
    posts, loading, loadingMore, error, hasMore,
    refresh, loadMore, removePost, toggleLike, toggleBookmark,
  } = usePosts({ only: "all" });

  function handleDelete(post) {
    requestDelete("post", () => removePost(post.id));
  }

  return (
    <div className="feed-layout">
      <main className="feed-main">
        {!loading && !error && <StoriesBar posts={posts} />}

        <button className="card composer-bar" onClick={() => navigate("/create-post")}>
          <div className="composer-fake-input">What's on your mind?</div>
          <span className="tool-chip tool-chip-static"><Plus size={16} /> Post</span>
        </button>

        {loading ? (
          <>
            <PostSkeleton /><PostSkeleton /><PostSkeleton />
          </>
        ) : error ? (
          <ErrorState subtitle={error} onRetry={refresh} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<Inbox size={26} />}
            title="Your feed is quiet"
            subtitle="Be the first to share something with the community."
            action={<button className="btn btn-primary btn-sm" onClick={() => navigate("/create-post")}>Create a post</button>}
          />
        ) : (
          <>
            <motion.div variants={listVariants} initial="hidden" animate="show">
              {posts.map((p) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <PostCard
                    post={p}
                    onToggleLike={toggleLike}
                    onToggleBookmark={toggleBookmark}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
            {hasMore && (
              <button className="btn btn-secondary btn-block" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Loading…" : <>Load more <ChevronDown size={15} /></>}
              </button>
            )}
          </>
        )}
      </main>
      <RightSidebar />
    </div>
  );
}
