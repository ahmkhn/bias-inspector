"use client";

import { SignedOut, SignInButton, SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
export function TopNav() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between border-b bg-white p-4 backdrop-blur-md">
      <div className="flex flex-row items-center gap-2 cursor-pointer border-2 border-slate-500 rounded-md p-1" onClick={ ()=>router.push("/") }>
        <Image src="/favicon.ico" alt="Bias Inspector" width={35} height={35}/>
        <Link href="/" className="text-xl font-semibold text-primary">Bias Inspector</Link>
      </div>
      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </nav>
  );
}