import NextAuth, { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "wd2e2adwua3215nAXW@_dw2XDauUNDW"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        // Assumindo que você tem uma forma de determinar o papel do usuário
        token.role = "client" // ou qualquer lógica para determinar o papel
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as string
        // Gerar o token JWT
        session.accessToken = jwt.sign(
          {
            userId: token.id,
            email: token.email,
            role: token.role,
          },
          JWT_SECRET,
          { expiresIn: "1h" },
        )
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

