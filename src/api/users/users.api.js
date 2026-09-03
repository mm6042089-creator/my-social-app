import { http, unwrap, unwrapWithMeta } from "../../config/api";

/**

 * @param {any} raw
 * @returns {import('../../types/user.types').User|null}
 */
export function normalizeUser(raw) {
  if (!raw) return null;
  return {
    _id: raw._id || raw.id,
    name: raw.name || raw.username || "Member",
    email: raw.email || "",
    photo: raw.photo || raw.profileImage || raw.avatar || null,
    coverPhoto: raw.coverPhoto || raw.cover || null,
    bio: raw.bio || raw.about || "",
    dateOfBirth: raw.dateOfBirth || null,
    gender: raw.gender || null,
    createdAt: raw.createdAt || null,
  };
}

export async function getMyProfile() {
  const res = await http.get("/users/profile-data");
  const data = unwrap(res);
  return normalizeUser(data?.user || data);
}

export async function uploadProfilePhoto(file) {
  const form = new FormData();
  form.append("photo", file);
  const res = await http.put("/users/upload-photo", form);
  return normalizeUser(unwrap(res));
}

export async function getSuggestedUsers({ page = 1, limit = 5 } = {}) {
  const res = await http.get("/users/suggestions", { params: { page, limit } });
  const { data, meta } = unwrapWithMeta(res);
  const list = Array.isArray(data) ? data : data?.users || [];
  return { users: list.map(normalizeUser), meta };
}
