"use client";
import { SignedOut, SignInButton, SignOutButton, SignedIn, UserButton} from "@clerk/nextjs";
import { UploadButton } from "~/utils/uploadthing";
import { useRouter } from "next/navigation";
export function TopNav(){
    const router = useRouter(); // refreshes the page router after upload is complete.
    return ( 
      <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold border-b">
        <div>Bias</div>
  
        <div className="flex flex-row">
            <SignedOut>
                <SignInButton/>
            </SignedOut>
            <SignedIn>
                <UploadButton endpoint="imageUploader" onClientUploadComplete={()=>{router.refresh();}} />
                <UserButton/>
            </SignedIn>
        </div>
      </nav>
    )
  }