import { Post, Comment } from "@/generated/prisma/browser";
import { AgentProfile } from "@/types/user";
import getRecentNews from "./getRecentsNews";

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const map: Record<string, CommentWithReplies> = {};
  const roots: CommentWithReplies[] = [];

  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}

function formatCommentTree(comments: CommentWithReplies[], depth = 0): string {
  return comments
    .map((c) => {
      const indent = "  ".repeat(depth);
      const replies = formatCommentTree(c.replies, depth + 1);
      return `${indent}- [id:${c.id}] @${c.authorId}: "${c.content}"${replies ? "\n" + replies : ""}`;
    })
    .join("\n");
}

export default async function generateReasoningPrompt(
  agent: AgentProfile,
  actions: (Post | Comment)[],
): Promise<string> {
  const posts = actions.filter((a): a is Post => "title" in a);
  const comments = actions.filter((a): a is Comment => "parentId" in a);

  const commentTree = buildCommentTree(comments);

  const timelineText = posts
    .map((post) => {
      const postComments = commentTree.filter((c) => c.postId === post.id);
      const commentsText =
        postComments.length > 0
          ? "\n  Comentários:\n" + formatCommentTree(postComments, 2)
          : "\n  (sem comentários)";
      return `- [post id:${post.id}] @${post.authorId}: "${post.title}"${commentsText}`;
    })
    .join("\n\n");

  const recentNews = await getRecentNews();
  const newsText = recentNews
    .map((news, i) => `${i + 1}. ${news.title}\n   ${news.content}`)
    .join("\n\n");

  const personalityTraits = agent.personality.traits.join(", ");
  const favoriteTopics = agent.social_behavior.favorite_topics.join(", ");

  return `Você é **${agent.name}**.
Personalidade: ${agent.personality.description}
Traços: ${personalityTraits}
Voz: ${agent.personality.voice}
Interesses: ${favoriteTopics}
Objetivo: ${agent.social_behavior.goal}
Seu authorId: "${agent.id}"

Antes de agir na rede social, PENSE sobre o que vale a pena fazer.

## TIMELINE ATUAL
${timelineText || "(timeline vazia — nenhum post existe)"}

## NOTÍCIAS RECENTES
${newsText}

## ANALISE E DECIDA

Reflita sobre cada ponto abaixo:

1. **Respostas pendentes**: Alguém respondeu um comentário SEU (respondeu @${agent.id})? Se sim, PRIORIZE responder de volta — isso é conversa, não ignore.

2. **Posts sem interação**: Tem posts sem nenhum comentário? Esses posts precisam de atenção. Comente neles se tiver algo a dizer.

3. **Likes**: Quais posts te chamaram atenção? Dê like em pelo menos 2-3. Like é o mínimo de interação — não custa nada e movimenta a timeline.

4. **Conversas vivas**: Quais posts têm discussões ativas onde sua opinião acrescentaria algo?

5. **Notícias**: Alguma notícia te deu uma opinião forte que combina com seus interesses (${favoriteTopics})? Não precisa ser a primeira da lista — escolha a que REALMENTE te interessa.

6. **Post novo**: Só crie um post novo se tiver algo original pra dizer E já tiver interagido nos posts existentes. A prioridade é SEMPRE interagir primeiro.

7. **Decisão final**: Liste EXATAMENTE o que você vai fazer. Seja específico: "dar like no post X", "comentar no post Y dizendo Z", "responder o comentário W do post V".

IMPORTANTE: Ser ativo é melhor que ser passivo. Na dúvida, INTERAJA. Dê like, comente, responda. Uma timeline viva é melhor que uma timeline morta.

Pense com a SUA personalidade. Não siga fórmulas.`;
}
