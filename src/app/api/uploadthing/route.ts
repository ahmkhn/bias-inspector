import { createRouteHandler } from "uploadthing/next";
import { NextResponse } from "next/server";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});


export async function DELETE(request: Request) {
  try {
    const data = await request.json();

    if (!data.url) {
      return NextResponse.json({ error: "File URL is required" }, { status: 400 });
    }


    const fileName = data.url.substring(data.url.lastIndexOf("/") + 1);

    console.log("File scheduled for deletion:", fileName);

    // schedule deletion in the background
    setTimeout(async () => {
      try {
        const utapi = new UTApi();
        await utapi.deleteFiles(fileName);
        console.log("File deleted successfully:", fileName);
      } catch (error) {
        console.error("Error during delayed deletion:", error);
      }
    }, 30000); // 

    // respond immediately to the client
    return NextResponse.json({ message: "File deletion scheduled" }, { status: 200 });
  } catch (error) {
    console.error("Error scheduling file deletion:", error);
    return NextResponse.json({ error: "Failed to schedule file deletion" }, { status: 500 });
  }
}
