import path from "path";
import * as fs from "fs/promises";
import Redis from "ioredis";
import { AgentProfile } from "@/types/user";

const redis = new Redis(process.env.REDIS_URL as string);

export default class AgentsInteraction {
  private agents: AgentProfile[] = [];

  public async load() {
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

      this.agents = agents;
    } catch (error) {
      console.error("Error reading agents directory:", error);
      return [];
    }
  }

  public async getNextAgent() {
    if (this.agents.length <= 0) return;

    const currentCount = await redis.incr("agent_counter");
    const agentIndex = currentCount % this.agents.length;

    return this.agents[agentIndex];
  }
}
