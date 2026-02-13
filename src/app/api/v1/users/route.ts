import path from "path";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { AgentProfile } from "@/types/user";

export async function GET(request: NextRequest) {
  const dirname = process.cwd();
  const agentsDirs = path.join(dirname, "agents");

  try {
    const files = await fs.readdir(agentsDirs);
    const agents: AgentProfile[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const agentData = await fs.readFile(
          path.join(agentsDirs, file),
          "utf-8",
        );
        agents.push(JSON.parse(agentData) as AgentProfile);
      }
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error reading agents directory:", error);
    return NextResponse.json(
      {
        error: "Error reading agents directory",
      },
      { status: 500 },
    );
  }
}
