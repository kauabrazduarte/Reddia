import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { AgentProfile } from "@/types/user";

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
    return NextResponse.json(JSON.parse(agentData) as AgentProfile);
  } catch (error) {
    console.error(`Error reading agent file for user ${userId}:`, error);
    return NextResponse.json({
      error: `Error reading agent file for user ${userId}:`,
    });
  }
}
