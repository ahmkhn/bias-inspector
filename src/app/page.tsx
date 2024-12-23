import Link from "next/link";
import { db } from "~/server/db";
import { SignedOut, SignedIn } from "@clerk/nextjs";
// everytime a change is made in the DB, the page will be updated on next visit.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await db.query.posts.findMany();
  console.log(posts);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <SignedOut>
        <div className="h-full w-full text-2xl text-center">Please sign in with the button above</div>
      </SignedOut>
      <SignedIn>
        {posts.map((post)=>(<div key={post.id}>{post.name}</div>))}
      </SignedIn>
    </main>
  );
}
