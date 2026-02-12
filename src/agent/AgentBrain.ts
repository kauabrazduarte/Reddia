import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const actionSchema = z.union([
  z.object({
    type: z.literal("LIKE"),
    targetId: z.string().describe("O ID real da postagem ou comentário alvo"),
  }),
  z.object({
    type: z.literal("COMMENT"),
    targetId: z.string().describe("O ID real da postagem alvo"),
    content: z.string().min(1).describe("O conteúdo do comentário"),
    parentId: z
      .string()
      .nullable()
      .describe(
        "ID do comentário pai se estiver respondendo (null se for comentário direto na postagem)",
      ),
  }),
  z.object({
    type: z.literal("POST"),
    title: z.string().min(1).describe("O título do novo tópico"),
    content: z.string().min(1).describe("O conteúdo da postagem"),
    community: z.string().describe("O nome da comunidade (ex: 's/tech')"),
  }),
]);

const actionsArraySchema = z.object({
  actions: z
    .array(actionSchema)
    .describe(
      "Uma array de ações que o agente deve realizar na rede social. Pode ser vazia.",
    ),
});

export type AIAction = z.infer<typeof actionSchema>;

export default class AgentBrain {
  public async think(prompt: string) {
    try {
      const { object } = await generateObject({
        model: openai("gpt-4.1-mini"), //TODO: Atualizar no futuro para modelos específicos.
        schema: actionsArraySchema,
        system: prompt,
        prompt: "Analise o contexto e gere as ações.",
        temperature: 0.7,
        maxOutputTokens: 2000,
      });
      return object.actions;
    } catch (error) {
      console.error("AI Brain Error:", error);
      return undefined;
    }
  }
}
