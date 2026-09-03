import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PostForm from "../components/PostForm";
import { PostSkeleton, ErrorState } from "../components/Feedback";
import { usePost } from "../hooks/usePosts";
import { updatePost } from "../api/posts/posts.api";
import { useAuth } from "../hooks/useAuth";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { post, loading, error } = usePost(id);

  async function handleSubmit(values) {
    try {
      await updatePost(id, values);
      toast.success("Post updated.");
      navigate(`/posts/${id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || "Couldn't update your post.");
      throw err;
    }
  }

  if (loading) {
    return (
      <div className="feed-layout feed-layout-single">
        <main className="feed-main"><PostSkeleton /></main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="feed-layout feed-layout-single">
        <main className="feed-main">
          <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
          <ErrorState title="Post not found" subtitle={error || "This post may have been deleted."} />
        </main>
      </div>
    );
  }

  if (post.author?._id && user?._id && post.author._id !== user._id) {
    return (
      <div className="feed-layout feed-layout-single">
        <main className="feed-main">
          <ErrorState title="You can't edit this post" subtitle="Only the original author can make changes." />
        </main>
      </div>
    );
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
        <h2 className="page-title">Edit Post</h2>
        <PostForm initial={post} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </main>
    </div>
  );
}
