import "server-only";
import { db } from "./db";
import { images } from "./db/schema";
import { auth } from "@clerk/nextjs/server";


export async function getUserPDFs() {

    const user = await auth();

    if(!user.userId) throw new Error("Unauthorized");

    const pdfs = await db.query.images.findMany({
        where: (model, {eq}) => eq(model.userId, user.userId),
        orderBy: (model, {desc}) => desc(model.id),
    });
    return pdfs;
}