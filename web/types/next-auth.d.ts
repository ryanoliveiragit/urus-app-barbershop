import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    email: string
    name: string
    image?: string
  }

  interface Session {
    user: User
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
