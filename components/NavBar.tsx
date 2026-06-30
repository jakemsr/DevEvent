"use client";

import Image from "next/image"
import Link from "next/link"
import { authClient } from "@/lib/auth-client";
import { SignIn, SignOut } from "@/components/SignInOutButtons"

const NavBar = () => {
  const {
    data: session,
    isPending,
    error,
    refetch
  } = authClient.useSession();

  return (
    <header>
      <nav>
        <Link href='/' className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

          <p>DevEvents</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/#events">Events</Link>
          {session ? (
            <>
            Hello, {session.user.firstName}!
            {(session.user.role === "creator" || session.user.role === "admin") &&
              <Link href="/create-event">Create Event</Link>}
            <SignOut />
            </>
          ) : (
            <SignIn />
          )}
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
