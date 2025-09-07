import { getAuthSession } from "@/lib/auth";
import { exchangeInstagramCode, fetchInstagramProfile, persistInstagramToken } from "@/lib/instagram";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  if (error) return NextResponse.json({ error }, { status: 400 });
  if (!code) return NextResponse.json({ error: "Code manquant" }, { status: 400 });
  try {
    const tokenData = await exchangeInstagramCode(code); // { access_token, user_id }
    const profile = await fetchInstagramProfile(tokenData.access_token); // { id, username }
    persistInstagramToken(session.user.id, tokenData, profile);
    return NextResponse.json({ ok: true, profile });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
