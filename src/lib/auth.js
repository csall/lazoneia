import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import { getServerSession } from "next-auth";

// Auth email/mot de passe retirée – uniquement OAuth.

// Construction dynamique des providers OAuth selon variables d'env présentes
function buildProviders() {
  if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
    providers.push(InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'user_profile,user_media'
        }
      }
    }));
  }
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
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'email'
        }
      }
    }));
  }
  // Provider credentials retiré (auth email/mot de passe désactivée)
  return providers;
}

// Validation minimale des variables critiques (évite l'erreur générique "server configuration")
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  // Lever une erreur claire qui apparaîtra dans les logs Vercel
  throw new Error("NEXTAUTH_SECRET manquant en production – ajoute-le dans Vercel > Project Settings > Environment Variables");
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  providers: buildProviders(),
  logger: {
    error(code, metadata){
      console.error('[NextAuth][error]', code, metadata);
    },
    warn(code) {
      console.warn('[NextAuth][warn]', code);
    },
    debug(code, metadata){
      if (process.env.NODE_ENV !== 'production') {
        console.log('[NextAuth][debug]', code, metadata);
      }
    }
  },
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
    },
    async signIn({ account }) {
      // Vérifie que l'on a bien un provider défini et que les creds sont présents (debug)
      if (!account) return true;
      return true;
    }
  }
};

// Avec NextAuth v4 on n'extrait pas des handlers depuis un appel hors route.
// Le fichier route `[...nextauth]/route.js` crée le handler.
// Helper côté serveur pour récupérer la session:
export const getAuthSession = () => getServerSession(authOptions);
