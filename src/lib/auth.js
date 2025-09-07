import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { compare } from "bcryptjs";
import { getServerSession } from "next-auth";

// Simple in-memory user store placeholder (replace with DB)
const users = [
  { id: '1', name: 'Demo User', email: 'demo@lazoneia.com', passwordHash: '$2a$10$uNH4YglpYqcjwx3arofS4OAoJ8aeJYfGrd/7s2SUrIUMumRbquvSG' } // password: demo123
];
// Stockage utilisateurs locaux retiré (connexion email désactivée)

// Construction dynamique des providers OAuth selon variables d'env présentes
function buildProviders() {
  const providers = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    }
  }
};

// Avec NextAuth v4 on n'extrait pas des handlers depuis un appel hors route.
// Le fichier route `[...nextauth]/route.js` crée le handler.
// Helper côté serveur pour récupérer la session:
export const getAuthSession = () => getServerSession(authOptions);
