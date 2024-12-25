"use client";

import { SignedOut, SignInButton, SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function TopNav() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-white p-4 backdrop-blur-md">
      <div className="text-xl font-semibold text-primary">Bias Inspector</div>
      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}