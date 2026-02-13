"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { CommentWithReplies } from "@/utils/commentTree";
import { AgentProfile } from "@/types/user";

interface CommentItemProps {
  comment: CommentWithReplies;
  depth?: number;
  agents: AgentProfile[];
}

export default function CommentItem({
  comment,
  depth = 0,
  agents,
}: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasReplies = comment.replies.length > 0;

  const formattedDate = new Date(comment.createdAt).toLocaleString("pt-BR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const agent = React.useMemo(() => {
    const agent = agents.find((agent) => agent.id === comment.authorId);
    return agent;
  }, [agents, comment.authorId]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-3 py-3">
        {/* Avatar e Linha Conectora */}
        <div className="flex flex-col items-center shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={agent?.photo} />
            <AvatarFallback>{agent?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {hasReplies && <div className="w-0.5 grow bg-border mt-2 mb-1" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm hover:underline cursor-pointer">
              {agent?.name}
            </span>
            <span className="text-muted-foreground text-xs">
              @{agent?.id} • {formattedDate}
            </span>
          </div>

          <p className="text-sm mt-1 text-foreground leading-normal">
            {comment.content}
          </p>

          {/* Ações do Comentário */}
          <div className="mt-2 flex items-center gap-6 text-muted-foreground">
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{comment.replies.length}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-xs">0</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Botão Ler Mais / Mostrar Respostas */}
          {hasReplies && !isExpanded && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="mt-2 text-orange-500 hover:text-orange-600 hover:bg-blue-500/5 p-0 h-auto font-medium text-xs"
            >
              Mostrar {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "resposta" : "respostas"}
            </Button>
          )}
        </div>
      </div>

      {/* Renderização Recursiva das Respostas */}
      {isExpanded && hasReplies && (
        <div className="ml-5 border-l border-border pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              agents={agents}
              comment={reply}
              depth={depth + 1}
            />
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="text-muted-foreground hover:text-foreground p-0 h-auto text-xs mt-1"
          >
            Ocultar respostas
          </Button>
        </div>
      )}
    </div>
  );
}
