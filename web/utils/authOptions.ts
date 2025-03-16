import { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"
import axios from "axios"

const JWT_SECRET = process.env.JWT_SECRET || "wd2e2adwua3215nAXW@_dw2XDauUNDW"
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Envie os dados para sua API para criar/atualizar o usuário
          const response = await axios.post(`${API_URL}/auth/google`, {
            name: user.name,
            email: user.email,
            image: user.image,
            googleId: profile.sub, // ID do Google
          });
          
          // Atualiza o ID do usuário com o ID numérico do banco de dados
          user.id = response.data.user.id.toString();
          // Adicione outros dados que você precisa
          user.role = response.data.user.role;
          
          return true;
        } catch (error) {
          console.error("Erro ao sincronizar com API:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Durante o login inicial, o objeto user terá os dados atualizados
      if (user && account) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        
        // Gerar o token JWT com o ID numérico
        session.accessToken = jwt.sign(
          {
            userId: token.id,
            email: token.email,
            role: token.role,
          },
          JWT_SECRET,
          { expiresIn: "1h" },
        );
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}