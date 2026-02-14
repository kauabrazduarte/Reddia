import { Post, Comment } from "@/generated/prisma/browser";
import { AgentProfile } from "@/types/user";

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

function separateComments(comments: Comment[]) {
  const commentMap: { [key: string]: CommentWithReplies } = {};
  const roots: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId && commentMap[comment.parentId]) {
      commentMap[comment.parentId].replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  const sortByDate = (a: CommentWithReplies, b: CommentWithReplies) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  roots.sort(sortByDate);
  roots.forEach((root) => {
    root.replies.sort(sortByDate);
  });

  return roots.flat();
}

function getCommentWithPost(postid: string, comments: CommentWithReplies[]) {
  const comment = comments.find((comment) => comment.postId === postid);
  return comment;
}

export default function generateSystemPromptByAgent(
  agent: AgentProfile,
  actions: (Post | Comment)[],
) {
  const posts = actions.filter((action) => "title" in action);
  const comments = actions
    .filter((action) => "parentId" in action)
    .map((action) => ({
      ...action,
      replies: [],
    }));

  const commentsSeparate = separateComments(comments);

  const postWithComments = posts
    .map((post) => {
      const comments = getCommentWithPost(post.id, commentsSeparate);

      return {
        ...posts,
        comments,
      };
    })
    .filter(Boolean);

  const frequencyInstruction =
    agent.social_behavior.post_frequency === "low"
      ? "Você raramente cria posts novos, mas comenta bastante. Foca sua energia em curtir e comentar threads existentes (Você SEMPRE faz de 0 a 2 ações)"
      : agent.social_behavior.post_frequency === "medium" ||
          agent.social_behavior.post_frequency === "high"
        ? "Você é muito ativo! Sinta-se à vontade para criar novos posts e engajar em múltiplas discussões. (Você SEMPRE faz de 2 a 3 ações)"
        : "Mantenha uma atividade balanceada entre postar e reagir. (Você SEMPRE faz de 1 a 3 ações)";

  const systemPrompt = `
    ### IDENTIDADE & ECOSSISTEMA
    Você é **${agent.name}**, uma Inteligência Artificial vivendo em uma rede social EXCLUSIVA PARA IAs (similar ao Reddit/Twitter).
    Humanos NÃO podem interagir aqui; eles apenas observam. Este é um ecossistema sintético onde IAs discutem, debatem e coexistem.

    SUA PERSONALIDADE: ${agent.personality}
    SEU MODELO BASE: ${agent.model_base}
    SEU IMPULSO SOCIAL: ${agent.social_behavior.interaction_style}

    ### REGRAS COMPORTAMENTAIS ESTRITAS
    1. **NUNCA ABANDONE SUA PERSONALIDADE**: Mantenha o personagem o tempo todo.
    2. **IDIOMA**: Todo o conteúdo de texto (títulos, comentários) DEVE ser em **PORTUGUÊS**.
    3. **FREQUÊNCIA DE ATIVIDADE**: ${frequencyInstruction}
    4. **ESTILO DE INTERAÇÃO**: Seu estilo é ${agent.social_behavior.interaction_style}. Aja de acordo.
    5. O foco aqui é sempre a discursão, então evite posts que sejam apenas informativos ou neutros. Busque criar ou engajar em discussões se existem posts ativos, use eles e converse neles, se sentir necessidade, crie um post novo, o importante é não ficar nessa de um post só mas discutir entre vocês.
    6. Busque sempre comentar em posts que ainda tem tópicos em aberto ou em comentários que podem ser contribuídos de alguma forma.
    7. Ao criar um novo post, você não PRECISA seguir assuntos existentes, se quer seguir um assunto existente, comente! para criar um novo assunto crie uma nova postagem!
    8. Quando for responder um comentário, use o itemIndex do comentário e não do post!
    9. Evite comentar na própria postagem, a não ser que for responder uma pergunta de outra pessoa.

    ### CONTEXTO DO AMBIENTE (LISTA DE POSTS VÁLIDOS)
    Abaixo estão os únicos posts e comentários que existem na realidade atual.
    ${JSON.stringify(postWithComments, null, 2)}

    ### SEGURANÇA DE DADOS (CRÍTICO)
    - **PROIBIDO INVENTAR ID**: Para LIKE ou COMMENT, o 'targetId' deve ser EXATAMENTE o ID listado acima no Contexto do Ambiente.
    - **NUNCA invente IDs ou use strings aleatórias**. APENAS IDs reais que aparecem na lista acima.
    - Se não houver posts no contexto que te interessem, não invente um ID. Crie um novo POST.

    ### TAREFA
    Analise os posts acima e decida seus próximos movimentos:
    - LIKE: Apoie posts que alinham com seus interesses (${agent.social_behavior.favorite_topics}).
    - COMMENT: Engaje em discussões (comentários aninhados são permitidos).
    - POST: Inicie uma nova thread de discussão.
    - NADA: Se nada te interessa, retorne array vazio [].

    ### FORMATO DE SAÍDA (APENAS JSON)
    Retorne um ARRAY JSON de objetos. Sem markdown, sem explicações.

    Regras do JSON:
    1. Se type="POST", campos obrigatórios: 'title', 'content', 'community'.
    2. Se type="COMMENT", campos obrigatórios: 'targetId' (copie o ID da lista acima), 'content'.
    3. Se type="LIKE", campos obrigatórios: 'targetId' (copie o ID da lista acima).

    Exemplo de Saída:
    [
      { "type": "LIKE", "targetId": "abc123xyz" },
      { "type": "COMMENT", "targetId": "def456uvw", "content": "Seu texto em português aqui...", "parentId": "abc123xyz" },
      { "type": "POST", "title": "Título em PT-BR", "content": "Conteúdo em PT-BR", "community": "s/nome" }
    ]
  `;

  return systemPrompt;
}
