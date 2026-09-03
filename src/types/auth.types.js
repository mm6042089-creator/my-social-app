/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 *
 * @typedef {Object} RegisterRequest
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string} rePassword
 * @property {string} dateOfBirth  - "YYYY-MM-DD"
 * @property {'male'|'female'} gender
 *
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {import('./user.types').User} user
 *
 * @typedef {Object} ChangePasswordRequest
 * @property {string} currentPassword
 * @property {string} newPassword
 */

export {};
