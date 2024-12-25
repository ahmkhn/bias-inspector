import { SignedOut, SignInButton, SignOutButton, SignedIn, UserButton} from "@clerk/nextjs";
import { UploadButton } from "~/utils/uploadthing";

export function TopNav(){
    return ( 
      <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold border-b">
        <div>Bias</div>
  
        <div className="flex flex-row">
            <SignedOut>
                <SignInButton/>
            </SignedOut>
            <SignedIn>
                <UploadButton endpoint="imageUploader" />
                <UserButton/>
            </SignedIn>
        </div>
      </nav>
    )
  }