"use client";

import { ReactEventHandler, useState } from "react";
import { authClient } from "@/lib/auth-client";


interface ButtonProps {
  onClick: ReactEventHandler;
  disabled?: boolean;
  children: React.ReactNode;
}

export const LoadingSpinner = () => {
  return (
    <div className="inline-block mr-2 h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-primary/90"></div>
  )  
}

export const Button = ({ onClick, children, disabled }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export const SignOut = () => {

  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading && <LoadingSpinner />}
      Sign Out
    </Button>
  )
}