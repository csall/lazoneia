// Simple in-memory token store for Instagram tokens.
// NOTE: Ephemeral in serverless environments. Replace with persistent DB (Prisma) in production.
const store = new Map(); // key: userId, value: { accessToken, userId, username, obtainedAt }

export function setInstagramToken(userId, data) {
  if (!userId) return;
  store.set(String(userId), { ...data, obtainedAt: Date.now() });
}

export function getInstagramToken(userId) {
  if (!userId) return null;
  return store.get(String(userId)) || null;
}

export function clearInstagramToken(userId) {
  if (!userId) return;
  store.delete(String(userId));
}

export function hasInstagramToken(userId) {
  return !!getInstagramToken(userId);
}
