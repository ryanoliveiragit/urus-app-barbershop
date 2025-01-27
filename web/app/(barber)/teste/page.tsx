"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { session, loading } = useAuth();

  if (!session) {
    return <div>Please sign in</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Signed in as {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      <button onClick={() => signOut()}>sair</button>
    </div>
  );
}
