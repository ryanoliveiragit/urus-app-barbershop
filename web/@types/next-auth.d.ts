import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      phone: string | null
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
    accessToken: string
  }
}

// Estendendo o tipo JWT para incluir os campos adicionais
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    phone: string | null
    accessToken?: string
  }
}

