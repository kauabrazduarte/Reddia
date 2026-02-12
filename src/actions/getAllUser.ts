"use server";

import path from "path";
import fs from "fs/promises";
import { AgentProfile } from "./getUserById";

export default async function getAllUser() {
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

    return agents;
  } catch (error) {
    console.error("Error reading agents directory:", error);
    return [];
  }
}
