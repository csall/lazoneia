import { setInstagramToken, getInstagramToken, clearInstagramToken } from "./instagramStore";

const AUTH_BASE = "https://api.instagram.com/oauth/authorize"; // Basic Display API
const TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const PROFILE_URL = "https://graph.instagram.com/me"; // fields=id,username

export function buildInstagramAuthUrl(state) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  if (!clientId || !redirectUri) throw new Error("Variables d'environnement Instagram manquantes");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "user_profile", // Basic Display scope
    response_type: "code",
    state,
  });
  return `${AUTH_BASE}?${params.toString()}`;
}

export async function exchangeInstagramCode(code) {
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) throw new Error("Variables d'environnement Instagram manquantes");
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });
  const res = await fetch(TOKEN_URL, { method: "POST", body: form });
  if (!res.ok) throw new Error("Échec échange du code");
  const data = await res.json(); // { access_token, user_id }
  return data;
}

export async function fetchInstagramProfile(accessToken) {
  const url = `${PROFILE_URL}?fields=id,username&access_token=${encodeURIComponent(accessToken)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Impossible de récupérer le profil");
  return res.json(); // { id, username }
}

export function persistInstagramToken(userId, tokenData, profile) {
  setInstagramToken(userId, { ...tokenData, ...profile });
}

export function getStoredInstagram(userId) {
  return getInstagramToken(userId);
}

export function revokeInstagram(userId) {
  clearInstagramToken(userId);
}
