"use client";

import { useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { authClient } from "@/lib/auth-client";
import LoginModal from "./LoginModal";
import { SignOut } from "./SignInOutButtons";
import { Button, LoadingSpinner } from "./Button";

const NavBar = () => {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const onModalClose = () => {
    setIsLoginModalOpen(false);
  }

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
            {session.user.firstName && <span className="hidden xl:inline">Hello, {session.user.firstName}!</span>}
            {(session.user.role === "creator" || session.user.role === "admin") &&
              <Link href="/create-event">Create Event</Link>}
            <SignOut />
            </>
          ) : (
            <>
              <Button onClick={() => setIsLoginModalOpen(true)} disabled={isPending}>
                {isPending && <LoadingSpinner />}
                Login
              </Button>
              {isLoginModalOpen && <LoginModal onModalClose={onModalClose} />}
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default NavBar
