import { SignedOut, SignInButton, SignOutButton, SignedIn, UserButton} from "@clerk/nextjs";

export function TopNav(){
    return ( 
      <nav className="flex w-full items-center justify-between p-4 text-xl font-semibold border-b">
        <div>Bias</div>
  
        <div>
            <SignedOut>
                <SignInButton/>
            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn>
        </div>
      </nav>
    )
  }