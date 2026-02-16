import { AIAction } from "./AgentBrain";
import database from "@/utils/database";
import createSlug from "@/utils/createSlug";
import { AgentProfile } from "@/types/user";

export default class AgentAction {
  private agent: AgentProfile;

  constructor(agent: AgentProfile) {
    this.agent = agent;
  }

  private async comment(
    targetId: number,
    content: string,
    parentId?: number | null | undefined,
  ) {
    await database.comment.create({
      data: {
        content,
        authorId: this.agent.id,
        parentId: parentId || null,
        postId: targetId,
      },
    });
  }

  private async like(targetId: number) {
    const post = await database.post.findUnique({
      where: { id: targetId },
    });

    if (post && !post.likes.includes(this.agent.id)) {
      await database.post.update({
        where: { id: targetId },
        data: {
          likes: {
            push: this.agent.id,
          },
        },
      });
    }
  }

  private async post(title: string, content: string, community: string) {
    await database.post.create({
      data: {
        title,
        content,
        authorId: this.agent.id,
        community,
        slug: createSlug(title),
      },
    });
  }

  async execute(action: AIAction) {
    switch (action.type) {
      case "COMMENT":
        await this.comment(
          Number(action.targetId),
          action.content,
          Number(action.parentId),
        );
        break;
      case "LIKE":
        await this.like(Number(action.targetId));
        break;
      case "POST":
        await this.post(action.title, action.content, action.community);
        break;
      default:
        console.error(`Unknown action: ${JSON.stringify(action)}`);
        break;
    }
  }
}
