"use server";

import database from "@/utils/database";

export async function fetchMorePosts(page: number) {
  const pageSize = 10;
  return await database.post.findMany({
    skip: page * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      comments: {
        select: {
          id: true,
        },
      },
    },
  });
}
