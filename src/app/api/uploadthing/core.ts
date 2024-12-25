import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { ratelimit } from "~/server/ratelimit";
const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    pdf: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })

    .middleware(async ({ req }) => {

      const user = auth();

      if (!(await user).userId) throw new UploadThingError("Unauthorized");

      const userId = (await user).userId;
      if (!userId) throw new UploadThingError("Unauthorized");
      const {success} = await ratelimit.limit( userId );
      if (!success) throw new UploadThingError("Rate limit exceeded");

      return { userId: (await user).userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      if (!metadata.userId) {
        throw new UploadThingError("User ID is null");
      }
      await db.insert(images).values({
        name: file.name,
        url: file.url,
        userId: metadata.userId,
      });
      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
