import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import { getServerSession } from "next-auth";

// Auth email/mot de passe retirée – uniquement OAuth.

// Construction dynamique des providers OAuth selon variables d'env présentes
function buildProviders() {
  const providers = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            'openid','email','profile',
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.modify',
            'https://www.googleapis.com/auth/gmail.send'
          ].join(' ')
        }
      },
      allowDangerousEmailAccountLinking: true
    }));
  }
  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    providers.push(FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    }));
  }
  // Provider credentials retiré (auth email/mot de passe désactivée)
  return providers;
}

export const authOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.user = user;
      if (account && account.provider === 'google') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token || token.refreshToken;
        token.expiresAt = Date.now() + (account.expires_in ? account.expires_in * 1000 : 3600*1000);
      }
      if (token.expiresAt && Date.now() > token.expiresAt - 60_000 && token.refreshToken) {
        try {
          const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken
          });
          const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body: params });
          if (r.ok) {
            const data = await r.json();
            token.accessToken = data.access_token;
            token.expiresAt = Date.now() + data.expires_in * 1000;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      if (token?.accessToken) session.accessToken = token.accessToken;
      return session;
    }
  }
};

// Avec NextAuth v4 on n'extrait pas des handlers depuis un appel hors route.
// Le fichier route `[...nextauth]/route.js` crée le handler.
// Helper côté serveur pour récupérer la session:
export const getAuthSession = () => getServerSession(authOptions);
