/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} body
 * @property {string|null} image
 * @property {import('./user.types').User} author
 * @property {string} createdAt
 * @property {number} likesCount
 * @property {boolean} isLiked
 * @property {boolean} isBookmarked
 * @property {number} commentsCount
 *
 * @typedef {Object} CreatePostRequest
 * @property {string} body
 * @property {File} [image]
 *
 * @typedef {Object} UpdatePostRequest
 * @property {string} [body]
 * @property {File} [image]
 * @property {boolean} [removeImage]
 */

export {};
