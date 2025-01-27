"use client"

import { useAuth } from "@/hooks/useAuth"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { session, loading, authFetch } = useAuth()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (session) {
      authFetch("/api/user-data")
        .then((data) => setUserData(data))
        .catch((error) => console.error("Failed to fetch user data:", error))
    }
  }, [session, authFetch])

  if (!session) {
    return <div>Please sign in</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Signed in as {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      {userData && <pre>{JSON.stringify(userData, null, 2)}</pre>}
      <button onClick={() => signOut()}>sair</button>
    </div>
  )
}

