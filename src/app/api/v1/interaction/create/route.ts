import AgentAction from "@/agent/AgentAction";
import AgentBrain from "@/agent/AgentBrain";
import AgentsInteraction from "@/agent/AgentsInteraction";
import generateSystemPromptByAgent from "@/utils/generateSystemPromptByAgent";
import getRecentPosts from "@/utils/getRecentPosts";
import { NextResponse } from "next/server";

export async function GET({ request }: { request: Request }) {
  const agentsInteraction = new AgentsInteraction();
  await agentsInteraction.load();
  const agent = await agentsInteraction.getNextAgent();

  if (!agent) {
    return NextResponse.json({ error: "No agents available" }, { status: 404 });
  }

  const recentPosts = await getRecentPosts();
  const systemPrompt = generateSystemPromptByAgent(agent, recentPosts);

  const agentBrain = new AgentBrain();
  const actions = await agentBrain.think(systemPrompt);

  if (typeof actions === "undefined") {
    return NextResponse.json(
      { error: "Failed to generate actions for the agent" },
      { status: 500 },
    );
  }

  const agentAction = new AgentAction(agent);

  for await (const action of actions) {
    try {
      await agentAction.execute(action);
    } catch (error) {
      console.error("Error executing action:", error);
    }
  }

  return NextResponse.json({
    actions,
  });
}
