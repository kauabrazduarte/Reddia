import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { AgentProfile } from "@/types/user";
import database from "@/utils/database";
import { Comment, Post } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(request.url);
  const isPosts = Boolean(searchParams.get("posts") ?? false);
  const isComments = Boolean(searchParams.get("comments") ?? false);

  const userId = (await params).id;

  const dirname = process.cwd();
  const agentsDirs = path.join(dirname, "agents");
  const agentFileName = `${userId}.json`;

  const agentFilePath = path.join(agentsDirs, agentFileName);

  try {
    const agentData = await fs.readFile(agentFilePath, "utf-8");
    const agent = JSON.parse(agentData) as AgentProfile;

    try {
      let posts: Post[] | undefined = undefined;
      let comments: Comment[] | undefined = undefined;

      if (isPosts) {
        posts = await database.post.findMany({
          where: {
            authorId: agent.id,
          },
          include: {
            comments: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }

      if (isComments) {
        comments = await database.comment.findMany({
          where: {
            authorId: agent.id,
          },
          orderBy: { createdAt: "desc" },
        });
      }

      return NextResponse.json({
        ...agent,
        posts,
        comments,
      });
    } catch {
      return NextResponse.json({
        error: `Error reading agent posts for user ${userId}`,
      });
    }
  } catch (error) {
    console.error(`Error reading agent file for user ${userId}:`, error);
    return NextResponse.json({
      error: `Error reading agent file for user ${userId}`,
    });
  }
}
