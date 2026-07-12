"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button, LoadingSpinner } from "./Button"


enum SignInMode {
  none = "",
  GitHub = "GitHub",
  email = "email",
  signUp = "signUp",
  passwordReset = "password reset",
}

interface LoginModalProps {
  onModalClose: () => void;
}

const LoginModal = ({ onModalClose }: LoginModalProps) => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);
  const [authenticating, setAuthenticating] = useState<SignInMode>(SignInMode.none);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const sendResetEmail = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    const resetURL = window.location.origin + "/reset-password";
    await authClient.requestPasswordReset({
      email,
      redirectTo: resetURL,
    });
    setMessage("Password reset email sent! Please check your inbox.");
  }

  interface SignInProps {
    mode: SignInMode;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }

  const SignIn = ({ mode, email, password, firstName, lastName }: SignInProps) => {

    const handleClick = async () => {
      setError(null);
      setAuthenticating(mode);
      let data, error;
      switch (mode) {
        case SignInMode.GitHub:
          ({data, error} = await authClient.signIn.social({
            provider: "github",
          }));
          break;
        case SignInMode.email:
          if (!email || !password) {
            error = new Error("Email and password are required");
            break;
          }
          ({data, error} = await authClient.signIn.email({
            email: email || "",
            password: password || "",
          }));
          break;
        case SignInMode.signUp:
          if (!firstName || !lastName || !email || !password) {
            error = new Error("All fields are required for sign up");
            break;
          }
          ({ data, error } = await authClient.signUp.email({
            name: `${firstName || ""} ${lastName || ""}`,
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            password: password || "",
          }));
          break;
        default:
          throw new Error(`Unsupported sign in mode: ${mode}`);
      }
      if (error) {
        setError(error.message || null);
      } else {
        if (mode === SignInMode.signUp) {
          setMessage("Sign up successful! Please check your email to verify your account.");
        } else {
          onModalClose();
        }
      }
      setAuthenticating(SignInMode.none);
    }

    return (
      <Button onClick={handleClick} disabled={authenticating !== SignInMode.none}>
        {authenticating === mode && <LoadingSpinner />}
        {mode === SignInMode.signUp ? "Sign Up" : `Sign In with ${mode}`}
      </Button>
    )
  }

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/75 flex justify-center items-center z-1000"
      onClick={onModalClose}
    >
      {message ? (
      <div className="border-2 rounded-lg w-96 flex flex-col items-center justify-center bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 w-full flex justify-end">
          <button onClick={onModalClose} className="cursor-pointer">
            X
          </button>
        </div>
        <div className="w-full p-4 text-center">
          {message}
        </div>
      </div>

      ):(
      <div className="border-2 rounded-lg w-96 flex flex-col items-center justify-center bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 w-full flex justify-between">
          <div className="text-black px-2">X</div>
          <div>
            <h2 className="text-lg font-bold text-center">
              {signUp ? "Sign Up" : "Login"}
            </h2>
          </div>
          <button onClick={onModalClose} className="cursor-pointer">
            X
          </button>
        </div>

        {error && <div className="w-full px-4 text-center text-red-400">{error}</div>}

        {!signUp && (
          <>
            <div className="mt-4">
              <SignIn mode={SignInMode.GitHub} />
            </div>
            <div className="flex items-center mt-4 px-4 w-full">
              <div className="grow border-t border-gray-300"></div>
              <span className="shrink mx-2">OR</span>
              <div className="grow border-t border-gray-300"></div>
            </div>
          </>
        )}
        <div className="my-4 grid grid-cols-4 px-4 w-full gap-2 items-center">
          {signUp && (
            <>
              <div className="col-span-1">
                First Name
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-2 rounded-md p-1 mt-1"
                />
              </div>
              <div className="col-span-1">
                Last Name
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-2 rounded-md p-1 mt-1"
                />
              </div>
            </>
          )}
          <div className="col-span-1">
            Email
          </div>
          <div className="col-span-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 rounded-md p-1 mt-1"
            />
          </div>
          <div className="col-span-1">
            Password
          </div>
          <div className="col-span-3">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 rounded-md p-1 mt-1"
            />
          </div>
        </div>
        <SignIn
          mode={signUp ? SignInMode.signUp : SignInMode.email}
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
        />
        <div className="mt-4">
          <span onClick={() => {setError(""); setSignUp(!signUp)}} className="cursor-pointer">
            {signUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </span>
        </div>
        <div className="my-4">
          <span onClick={() => {setError(""); sendResetEmail();}} className="cursor-pointer">
            Forgot Password? Request reset email
          </span>
        </div>
      </div>
      )}
    </div>
  );
}

export default LoginModal;
