"use client";

import { useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { authClient } from "@/lib/auth-client";
import LoginModal from "./LoginModal";
import { SignOut } from "./SignInOutButtons";
import { Button, LoadingSpinner } from "./Button";
import NavMenu from "./NavMenu";

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

        <div className="z-50">
          <NavMenu />
          {session ? (
            <SignOut />
          ) : (
            <>
              <Button onClick={() => setIsLoginModalOpen(true)} disabled={isPending}>
                {isPending && <LoadingSpinner />}
                Login
              </Button>
              {isLoginModalOpen && <LoginModal onModalClose={onModalClose} />}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default NavBar
