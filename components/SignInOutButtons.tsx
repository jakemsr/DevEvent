"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ReactEventHandler } from "react";

interface ButtonProps {
  onClick: ReactEventHandler;
  children: React.ReactNode;
}

const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function SignIn() {

  const handleClick = async () => {
        await authClient.signIn.social({
           provider: "github",
        });
  }

  return (
      <Button onClick={handleClick}>
        Sign In
      </Button>
  )
}

export function SignOut() {

  const router = useRouter();

  const handleClick = async () => {
        await authClient.signOut();
        /*
        {
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          }
        }
        */
  }

  return (
      <Button onClick={handleClick}>
        Sign Out
      </Button>
  )
}