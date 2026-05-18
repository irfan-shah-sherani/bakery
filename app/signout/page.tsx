"use client";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="pt-40">Welcome back, {session?.user?.name}!</h1>
      <button  onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}