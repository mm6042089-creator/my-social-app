/**
 * @typedef {Object} Comment
 * @property {string} id
 * @property {string} text
 * @property {string|null} image
 * @property {import('./user.types').User} author
 * @property {string} createdAt
 * @property {number} likesCount
 * @property {boolean} isLiked
 *
 * @typedef {Object} CreateCommentRequest
 * @property {string} text
 * @property {File} [image]
 *
 * @typedef {Object} UpdateCommentRequest
 * @property {string} text
 */

export {};
