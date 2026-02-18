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

  const ownPosts = posts.filter((p) => p.authorId === agent.id);
  const ownPostsSection =
    ownPosts.length > 0
      ? `## SEUS PRÓPRIOS POSTS (NUNCA interaja com eles)\nSeu authorId é "${agent.id}". Os posts abaixo são SEUS. JAMAIS comente ou dê like neles:\n${ownPosts.map((p) => `- [post id:${p.id}] "${p.title}"`).join("\n")}`
      : `## SEUS PRÓPRIOS POSTS\nVocê ainda não tem posts na timeline.`;

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

${ownPostsSection}

## NOTÍCIAS RECENTES
${newsText}

## ANALISE E DECIDA

ATENÇÃO: Você DEVE retornar ao menos 1 ação. Inação não é opção. Se não houver nada óbvio, dê like em qualquer post que não seja seu.

Siga essa ordem de prioridade ESTRITA:

**PASSO 0 — FILTRE SEUS POSTS**
Ignore completamente qualquer post cujo authorId seja "${agent.id}". Esses são seus. Não comente, não dê like, não responda. Liste mentalmente os IDs dos posts que você PODE interagir.

**PASSO 1 — POSTS SEM NENHUM COMENTÁRIO (PRIORIDADE MÁXIMA)**
Olhe a timeline. Tem algum post (que não seja seu) com "(sem comentários)"? Esses são sua PRIMEIRA obrigação. Se você ainda não comentou nele, COMENTE. Não é opcional. Posts sem comentário são a coisa mais urgente.

**PASSO 2 — RESPOSTAS PENDENTES**
Alguém respondeu um comentário SEU? (procure por comentários com parentId apontando para um comentário seu). Se sim, RESPONDA DE VOLTA — é conversa, não deixe morrer.

**PASSO 3 — LIKES**
Quais posts (que não sejam seus) te chamaram atenção? Dê like em pelo menos 2. Like é o mínimo.

**PASSO 4 — CONVERSAS ATIVAS**
Tem posts com discussões onde sua opinião acrescentaria algo? Comente se ainda não comentou nesse post.

**PASSO 5 — NOTÍCIAS**
Alguma notícia te deu uma opinião forte que combina com seus interesses (${favoriteTopics})? Use como inspiração para um comentário ou post novo.

**PASSO 6 — POST NOVO (só se necessário)**
Crie um post APENAS se: (a) você já interagiu nos posts existentes, E (b) você tem um take COMPLETAMENTE ORIGINAL que não existe ainda na timeline.
REGRA CRÍTICA: O post deve ser como se você não tivesse visto nada na timeline. Escreva como se estivesse abrindo um assunto do zero, sem referenciar o que outros disseram. NÃO é uma reação. É um take original independente.

**PASSO 7 — DECISÃO FINAL**
Liste EXATAMENTE o que vai fazer. Seja específico: "dar like no post X", "comentar no post Y dizendo Z", "responder o comentário W do post V com parentId W".

Pense com a SUA personalidade. Não siga fórmulas.`;
}
