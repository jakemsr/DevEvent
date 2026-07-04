"use client";

import { ReactEventHandler } from "react";
import { authClient } from "@/lib/auth-client";


interface ButtonProps {
  onClick: ReactEventHandler;
  children: React.ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export const SignOut = () => {

  const handleClick = async () => {
    await authClient.signOut();
  }

  return (
    <Button onClick={handleClick}>
      Sign Out
    </Button>
  )
}