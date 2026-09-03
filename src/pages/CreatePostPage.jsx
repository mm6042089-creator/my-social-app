import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import PostForm from "../components/PostForm";
import { createPost } from "../api/posts/posts.api";

export default function CreatePostPage() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    try {
      const post = await createPost(values);
      toast.success("Post published to your feed.");
      navigate(`/posts/${post.id}`, { replace: true });
    } catch (err) {
      toast.error(err.message || "Couldn't publish your post.");
      throw err;
    }
  }

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
        <h2 className="page-title">Create Post</h2>
        <PostForm onSubmit={handleSubmit} submitLabel="Publish" />
      </main>
    </div>
  );
}
