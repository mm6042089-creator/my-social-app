import React from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { ArrowLeft, Heart, MessageSquare, Share2, Bookmark, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { EmptyState, ErrorState } from "../components/Feedback";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import { usePost } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { deletePost } from "../api/posts/posts.api";
import { useAuth } from "../hooks/useAuth";
import { cx, timeAgo } from "../utils/helpers";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const { requestDelete } = useOutletContext();

  const { post, loading, error, toggleLike, toggleBookmark } = usePost(id);
  const { comments, loading: commentsLoading, addComment, editComment, removeComment } = useComments(id);

  if (loading) {
    return (
      <div className="feed-layout feed-layout-single">
        <main className="feed-main">
          <div className="card post-card"><div className="skel skel-line" style={{ width: "60%" }} /></div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="feed-layout feed-layout-single">
        <main className="feed-main">
          <button className="back-link" onClick={() => navigate("/home")}><ArrowLeft size={16} /> Back</button>
          {error ? <ErrorState subtitle={error} /> : <EmptyState title="Post not found" subtitle="It may have been deleted or the link is broken." />}
        </main>
      </div>
    );
  }

  const author = post.author || {};
  const mine = me && author && author._id === me._id;

  function handleDeleteComment(comment) {
    requestDelete("comment", () => removeComment(comment.id));
  }

  function handleDeletePost() {
    requestDelete("post", async () => {
      try {
        await deletePost(post.id);
        toast.success("Post deleted.");
        navigate("/home");
      } catch (err) {
        toast.error(err.message || "Couldn't delete the post.");
        throw err;
      }
    });
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>

        <article className="card post-card post-detail-card">
          <div className="post-head">
            <div className="post-head-user">
              <Avatar user={author} size={48} accent />
              <div>
                <div className="post-name-row">
                  <span className="post-name">{author.name}</span>
                </div>
                <div className="post-meta">{timeAgo(post.createdAt)}</div>
              </div>
            </div>
            {mine && (
              <div style={{ display: "flex", gap: 4 }}>
                <button className="icon-btn" onClick={() => navigate(`/edit-post/${post.id}`)} aria-label="Edit post"><Edit2 size={16} /></button>
                <button className="icon-btn" onClick={handleDeletePost} aria-label="Delete post"><Trash2 size={16} /></button>
              </div>
            )}
          </div>

          <p className="post-text post-detail-text">{post.body}</p>
          {post.image && (
            <div className="post-image-wrap"><img src={post.image} alt="Post attachment" className="post-image" /></div>
          )}

          <div className="post-detail-stats">
            <span><strong>{post.likesCount}</strong> likes</span>
            <span><strong>{comments.length}</strong> comments</span>
          </div>

          <div className="post-actions post-actions-bordered">
            <button className={cx("post-action", post.isLiked && "post-action-active")} onClick={toggleLike}>
              <Heart size={19} fill={post.isLiked ? "currentColor" : "none"} /> Like
            </button>
            <button className="post-action"><MessageSquare size={19} /> Comment</button>
            <button className="post-action" onClick={() => toast.success("Share link copied to clipboard.")}>
              <Share2 size={19} /> Share
            </button>
            <button className={cx("post-action", "post-action-save", post.isBookmarked && "post-action-active")} onClick={toggleBookmark}>
              <Bookmark size={19} fill={post.isBookmarked ? "currentColor" : "none"} /> Save
            </button>
          </div>
        </article>

        <div className="card comments-card">
          <div className="section-title">Comments</div>
          <CommentForm onSubmit={addComment} />
          {commentsLoading ? (
            <div className="skel skel-line" style={{ width: "50%", marginTop: 16 }} />
          ) : (
            <CommentList comments={comments} onEdit={editComment} onDelete={handleDeleteComment} />
          )}
        </div>
      </main>
    </div>
  );
}
