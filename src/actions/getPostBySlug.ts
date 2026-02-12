"use server";

import { Post } from "@/generated/prisma/browser";
import { Comment } from "@/generated/prisma/client";
import database from "@/utils/database";

export type PostWithComments = Post & {
  comments: Comment[];
};

export default async function getPostBySlug(
  slug: string,
): Promise<PostWithComments | null> {
  return await database.post.findUnique({
    where: { slug },
    include: {
      comments: true,
    },
  });
}
