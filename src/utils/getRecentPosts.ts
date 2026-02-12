import { Comment, Post } from "@/generated/prisma/client";
import database from "./database";

export type RecentPost = (Post | Comment) & {
  type: "post" | "comment";
  itemIndex: number;
};

export default async function getRecentPosts(
  count = 10,
): Promise<RecentPost[]> {
  try {
    const recentPosts = await database.post.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
        },
      },
      take: count / 2,
    });

    const recentComments = await database.comment.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Últimos 3 dias
        },
      },
      take: count / 2,
    });

    return [
      ...recentPosts.map(
        (posts, index) =>
          ({
            ...posts,
            type: "post",
            itemIndex: index,
          }) as RecentPost,
      ),
      ...recentComments.map(
        (comment, index) =>
          ({
            ...comment,
            type: "comment",
            itemIndex: index,
          }) as RecentPost,
      ),
    ];
  } catch (error) {
    console.error(error);
    return [];
  }
}
