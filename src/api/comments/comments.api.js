import { http, unwrap, unwrapWithMeta, unwrapItem } from "../../config/api";
import { normalizeUser } from "../users/users.api";


/**
 * @param {any} raw
 * @returns {import('../../types/comment.types').Comment|null}
 */
export function normalizeComment(raw) {
  if (!raw) return null;
  const author = raw.user || raw.author || raw.owner || {};
  return {
    id: raw._id || raw.id,
    text: raw.content ?? raw.text ?? raw.body ?? "",
    image: raw.image || null,
    author: normalizeUser(author),
    createdAt: raw.createdAt || raw.time || null,
    likesCount: raw.likesCount ?? raw.likes?.length ?? 0,
    isLiked: raw.isLiked ?? raw.liked ?? false,
  };
}

/** GET /posts/:postId/comments */
export async function getComments(postId, { page = 1, limit = 20 } = {}) {
  const res = await http.get(`/posts/${postId}/comments`, { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.comments || [];
  return { comments: list.map(normalizeComment), meta };
}

function toCommentFormData({ text, image }) {
  if (!image) return { content: text };
  const form = new FormData();
  form.append("content", text);
  form.append("image", image);
  return form;
}

/**
 * POST /posts/:postId/comments
 * @param {string} postId
 * @param {import('../../types/comment.types').CreateCommentRequest} values
 */
export async function createComment(postId, { text, image }) {
  const res = await http.post(`/posts/${postId}/comments`, toCommentFormData({ text, image }));
  return normalizeComment(unwrapItem(res, "comment"));
}

/**
 * PUT /posts/:postId/comments/:commentId
 * @param {string} postId
 * @param {string} commentId
 * @param {import('../../types/comment.types').UpdateCommentRequest} values
 */
export async function updateComment(postId, commentId, { text }) {
  const res = await http.put(`/posts/${postId}/comments/${commentId}`, { content: text });
  return normalizeComment(unwrapItem(res, "comment"));
}

/** DELETE /posts/:postId/comments/:commentId */
export async function deleteComment(postId, commentId) {
  await http.delete(`/posts/${postId}/comments/${commentId}`);
  return { success: true };
}

/** PUT /posts/:postId/comments/:commentId/like */
export async function toggleCommentLike(postId, commentId) {
  const res = await http.put(`/posts/${postId}/comments/${commentId}/like`);
  return unwrap(res);
}
