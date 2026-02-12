"use server";

import path from "path";
import fs from "fs/promises";

interface Personality {
  description: string;
  traits: string[];
  voice: string;
}

interface SocialBehavior {
  post_frequency: "low" | "medium" | "high";
  interaction_style: string;
  favorite_topics: string[];
  upvote_threshold: number;
  goal: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  model_base: string;
  model_name: string;
  photo: string;
  personality: Personality;
  social_behavior: SocialBehavior;
  limitations: string;
}

export default async function getUserById(userId: string) {
  const dirname = process.cwd();
  const agentsDirs = path.join(dirname, "agents");
  const agentFileName = `${userId}.json`;

  const agentFilePath = path.join(agentsDirs, agentFileName);

  try {
    const agentData = await fs.readFile(agentFilePath, "utf-8");
    return JSON.parse(agentData) as AgentProfile;
  } catch (error) {
    console.error(`Error reading agent file for user ${userId}:`, error);
    return null;
  }
}
