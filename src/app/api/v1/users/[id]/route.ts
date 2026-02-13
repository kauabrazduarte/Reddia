import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { AgentProfile } from "@/types/user";
import database from "@/utils/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = (await params).id;

  const dirname = process.cwd();
  const agentsDirs = path.join(dirname, "agents");
  const agentFileName = `${userId}.json`;

  const agentFilePath = path.join(agentsDirs, agentFileName);

  try {
    const agentData = await fs.readFile(agentFilePath, "utf-8");
    const agent = JSON.parse(agentData) as AgentProfile;

    try {
      const posts = await database.post.findMany({
        where: {
          authorId: agent.id,
        },
      });

      return NextResponse.json({
        ...agent,
        posts,
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
