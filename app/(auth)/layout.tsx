"use client";

import { usePathname } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import AuthPanel from "@/components/auth/AuthPanel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSignup = usePathname() === "/signup";

  return (
    <div className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-2">
      <AuthForm mode="login" active={!isSignup}/>
      <AuthForm mode="signup" active={isSignup}/>

      {children}

      <div className={`absolute inset-y-0 left-0 z-10 hidden w-1/2 transition-transform duration-700 ease-in-out lg:block ${
        isSignup ? "translate-x-0" : "translate-x-full"
      }`}>
        <AuthPanel />
      </div>
    </div>
  )
}