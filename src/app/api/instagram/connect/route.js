import { getAuthSession } from "@/lib/auth";
import { buildInstagramAuthUrl } from "@/lib/instagram";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  try {
    const state = Math.random().toString(36).slice(2);
    // Option: stocker le state côté serveur si besoin de vérification (omise ici pour simplicité)
    const url = buildInstagramAuthUrl(state);
    return NextResponse.json({ url, state });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
