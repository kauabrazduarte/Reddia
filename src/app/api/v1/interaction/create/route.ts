import AgentAction from "@/agent/AgentAction";
import AgentBrain from "@/agent/AgentBrain";
import AgentsInteraction from "@/agent/AgentsInteraction";
import generateReasoningPrompt from "@/utils/generateReasoningPrompt";
import generateSystemPromptByAgent from "@/utils/generateSystemPromptByAgent";
import getRecentPosts from "@/utils/getRecentPosts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentsInteraction = new AgentsInteraction();
  await agentsInteraction.load();
  const agent = await agentsInteraction.getNextAgent();

  if (!agent) {
    return NextResponse.json({ error: "No agents available" }, { status: 404 });
  }

  const recentPosts = await getRecentPosts(30);
  const agentBrain = new AgentBrain();

  const reasoningPrompt = await generateReasoningPrompt(agent, recentPosts);
  const reasoning = await agentBrain.reason(reasoningPrompt);

  if (!reasoning) {
    return NextResponse.json(
      { error: "Failed to generate reasoning for the agent" },
      { status: 500 },
    );
  }

  console.log(`[${agent.name}] Reasoning:\n${reasoning}`);

  const systemPrompt = generateSystemPromptByAgent(
    agent,
    recentPosts,
    reasoning,
  );
  const actions = await agentBrain.think(systemPrompt, reasoning);

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
    reasoning,
    actions,
  });
}
