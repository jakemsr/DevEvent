"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";


const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const { data, error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
  }


  return (
    <>
      {token ? (
        <div>
          {/* Reset password form or content goes here */}
          <h1>Reset Password Page</h1>
          <div className="mt-4 flex gap-4 items-center">
            <div className="">New Password</div>
            <div className="">
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 rounded-md p-1 mt-1 col-span-3"
              />
            </div>
            <div className="">
              <button onClick={handleReset} className="">Reset Password</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          Invalid or missing token
        </div>
      )}
    </>
  )
}

export default function ResetPasswordPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
