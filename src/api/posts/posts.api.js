import { http, unwrap, unwrapWithMeta, unwrapItem } from "../../config/api";
import { normalizeUser } from "../users/users.api";

/**
 * Posts & Feed endpoints — Route Posts API.
 * GET    /posts                              Public post listing (newest first)
 * GET    /posts/feed?only=&page=&limit=       Home timeline (following/me/all)
 * POST   /posts                               Create post (body/image)
 * PUT    /posts/:postId                       Update body/image or remove image
 * PUT    /posts/:postId/like                  Toggle like
 * PUT    /posts/:postId/bookmark               Toggle bookmark
 * GET    /users/bookmarks?page=&limit=         List the current user's saved posts
 *

/**
 * @param {any} raw
 * @returns {import('../../types/post.types').Post|null}
 */
export function normalizePost(raw) {
  if (!raw) return null;
  const author = raw.user || raw.author || raw.owner || {};
  const id = raw._id || raw.id;
  if (!id) {
    // Surfaces as a clear, catchable error instead of silently producing
    // a post with no id (which breaks any route built from post.id, e.g.
    // navigating to /posts/undefined after creating a post).
    console.error("normalizePost: response had no _id/id field", raw);
    throw new Error("The server didn't return a valid post. Please refresh and try again.");
  }
  return {
    id,
    body: raw.body ?? raw.text ?? raw.content ?? "",
    image: raw.image || raw.imageUrl || null,
    author: normalizeUser(author),
    createdAt: raw.createdAt || raw.time || null,
    likesCount: raw.likesCount ?? raw.likes?.length ?? raw.likes ?? 0,
    isLiked: raw.isLiked ?? raw.liked ?? false,
    isBookmarked: raw.isBookmarked ?? raw.bookmarked ?? false,
    commentsCount: raw.commentsCount ?? raw.comments?.length ?? raw.comments ?? 0,
  };
}

/** GET /posts */
export async function getPosts({ page = 1, limit = 10 } = {}) {
  const res = await http.get("/posts", { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.posts || [];
  return { posts: list.map(normalizePost), meta };
}

/** GET /posts/feed?only=&page=&limit= */
export async function getFeed({ only = "all", page = 1, limit = 10 } = {}) {
  const res = await http.get("/posts/feed", { params: { only, page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.posts || [];
  return { posts: list.map(normalizePost), meta };
}

/** GET /posts/:postId */
export async function getPostById(postId) {
  const res = await http.get(`/posts/${postId}`);
  return normalizePost(unwrapItem(res, "post"));
}

/** GET /users/:userId/posts — a specific user's posts (confirmed endpoint). */
export async function getUserPosts(userId, { page = 1, limit = 20 } = {}) {
  const res = await http.get(`/users/${userId}/posts`, { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.posts || [];
  return { posts: list.map(normalizePost), meta };
}

/** GET /users/bookmarks — posts the current user has saved. */
export async function getBookmarks({ page = 1, limit = 20 } = {}) {
  const res = await http.get("/users/bookmarks", { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.posts || data?.bookmarks || [];
  return { posts: list.map(normalizePost), meta };
}

function toPostFormData({ body, image, removeImage }) {
  const form = new FormData();
  if (body !== undefined) form.append("body", body);
  if (image) form.append("image", image);
  if (removeImage) form.append("removeImage", "true");
  return form;
}

/**
 * POST /posts
 * @param {import('../../types/post.types').CreatePostRequest} values
 */
export async function createPost({ body, image }) {
  const res = await http.post("/posts", toPostFormData({ body, image }));
  return normalizePost(unwrapItem(res, "post"));
}

/**
 * PUT /posts/:postId
 * @param {string} postId
 * @param {import('../../types/post.types').UpdatePostRequest} values
 */
export async function updatePost(postId, { body, image, removeImage }) {
  const res = await http.put(`/posts/${postId}`, toPostFormData({ body, image, removeImage }));
  return normalizePost(unwrapItem(res, "post"));
}

/** DELETE /posts/:postId */
export async function deletePost(postId) {
  await http.delete(`/posts/${postId}`);
  return { success: true };
}

/** PUT /posts/:postId/like */
export async function toggleLike(postId) {
  const res = await http.put(`/posts/${postId}/like`);
  return unwrap(res);
}

/** PUT /posts/:postId/bookmark */
export async function toggleBookmark(postId) {
  const res = await http.put(`/posts/${postId}/bookmark`);
  return unwrap(res);
}

/** POST /posts/:postId/share */
export async function sharePost(postId) {
  const res = await http.post(`/posts/${postId}/share`);
  return normalizePost(unwrap(res));
}
