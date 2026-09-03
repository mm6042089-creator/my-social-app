import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { Camera, MapPin, Info, Grid3x3, Images, UserRound, KeyRound } from "lucide-react";
import PostCard from "../components/PostCard";
import { EmptyState, ErrorState } from "../components/Feedback";
import { useAuth } from "../hooks/useAuth";
import { getUserPosts, deletePost, toggleLike as apiToggleLike, toggleBookmark as apiToggleBookmark } from "../api/posts/posts.api";
import { uploadProfilePhoto } from "../api/users/users.api";
import { cx } from "../utils/helpers";

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { requestDelete } = useOutletContext();
  const [tab, setTab] = useState("posts");
  const [uploading, setUploading] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyPosts = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const { posts } = await getUserPosts(user._id, { limit: 50 });
      setMyPosts(posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const mediaPosts = useMemo(() => myPosts.filter((p) => p.image), [myPosts]);

  function handleDelete(post) {
    requestDelete("post", async () => {
      try {
        await deletePost(post.id);
        setMyPosts((prev) => prev.filter((p) => p.id !== post.id));
        toast.success("Post deleted.");
      } catch (err) {
        toast.error(err.message || "Couldn't delete the post.");
        throw err;
      }
    });
  }

  async function toggleLike(postId) {
    setMyPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) } : p)));
    try {
      await apiToggleLike(postId);
    } catch (err) {
      setMyPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.likesCount + (p.isLiked ? -1 : 1) } : p)));
      toast.error(err.message || "Couldn't update like.");
    }
  }

  async function toggleBookmark(postId) {
    setMyPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
    try {
      await apiToggleBookmark(postId);
    } catch (err) {
      setMyPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
      toast.error(err.message || "Couldn't update bookmark.");
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadProfilePhoto(file);
      await refreshProfile();
      toast.success("Profile photo updated.");
    } catch (err) {
      toast.error(err.message || "Couldn't update your photo.");
    } finally {
      setUploading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="feed-layout feed-layout-single">
      <main className="feed-main">
        <div className="card profile-card">
          <div
            className="profile-cover"
            style={user.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})` } : undefined}
          />
          <div className="profile-body">
            <div className="profile-avatar-row">
              <div className="profile-avatar-frame">
                {user.photo ? (
                  <img src={user.photo} alt={user.name} />
                ) : (
                  <div className="avatar-fallback" style={{ width: "100%", height: "100%", fontSize: 28 }}>
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <label className="icon-btn avatar-edit" aria-label="Change profile photo">
                  <Camera size={14} />
                  <input type="file" name="profilePhoto" id="profilePhoto" accept="image/*" hidden onChange={handlePhotoChange} disabled={uploading} />
                </label>
              </div>
              <Link to="/change-password" className="btn btn-secondary btn-sm">
                <KeyRound size={14} /> Change Password
              </Link>
            </div>

            <div className="profile-name-row">
              <h2>{user.name}</h2>
            </div>
            <div className="profile-handle">{user.email}</div>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-meta-row">
              {user.dateOfBirth && <span><MapPin size={14} /> Born {user.dateOfBirth}</span>}
              {user.createdAt && <span><Info size={14} /> Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>}
            </div>

            <div className="profile-stats">
              <div><strong>{myPosts.length}</strong><span>Posts</span></div>
            </div>

            <div className="profile-tabs">
              <button className={cx("profile-tab", tab === "posts" && "profile-tab-active")} onClick={() => setTab("posts")}>
                <Grid3x3 size={15} /> Posts
              </button>
              <button className={cx("profile-tab", tab === "media" && "profile-tab-active")} onClick={() => setTab("media")}>
                <Images size={15} /> Media
              </button>
              <button className={cx("profile-tab", tab === "about" && "profile-tab-active")} onClick={() => setTab("about")}>
                <UserRound size={15} /> About
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card post-card"><div className="skel skel-line" style={{ width: "50%" }} /></div>
        ) : error ? (
          <ErrorState subtitle={error} />
        ) : (
          <>
            {tab === "posts" && (
              myPosts.length === 0 ? (
                <EmptyState icon={<Grid3x3 size={24} />} title="No posts yet" subtitle="Anything you publish will show up on your profile." />
              ) : myPosts.map((p) => (
                <PostCard key={p.id} post={p} onToggleLike={toggleLike} onToggleBookmark={toggleBookmark} onDelete={handleDelete} />
              ))
            )}

            {tab === "media" && (
              mediaPosts.length === 0 ? (
                <EmptyState icon={<Images size={24} />} title="No media yet" subtitle="Photos from your posts will appear here." />
              ) : (
                <div className="media-grid">
                  {mediaPosts.map((p) => (
                    <Link key={p.id} to={`/posts/${p.id}`} className="media-tile">
                      <img src={p.image} alt="" />
                    </Link>
                  ))}
                </div>
              )
            )}

            {tab === "about" && (
              <div className="card about-card">
                <div className="about-row"><span>Name</span><p>{user.name}</p></div>
                <div className="about-row"><span>Email</span><p>{user.email}</p></div>
                {user.bio && <div className="about-row"><span>Bio</span><p>{user.bio}</p></div>}
                {user.gender && <div className="about-row"><span>Gender</span><p>{user.gender}</p></div>}
                {user.dateOfBirth && <div className="about-row"><span>Date of birth</span><p>{user.dateOfBirth}</p></div>}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
