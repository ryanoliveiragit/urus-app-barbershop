import { useSession } from "next-auth/react"
import { useState } from "react"

export function useAuth() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!session) {
      throw new Error("Not authenticated")
    }

    setLoading(true)
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      if (!res.ok) {
        throw new Error("API request failed")
      }

      return await res.json()
    } finally {
      setLoading(false)
    }
  }

  return { session, loading, authFetch }
}

