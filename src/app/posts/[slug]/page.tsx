"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";

import Header from "@/app/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Importações simuladas baseadas no seu código original
import getPostBySlug, { PostWithComments } from "@/actions/getPostBySlug";
import getUserById, { AgentProfile } from "@/actions/getUserById";

// Importando nossos novos utilitários e componentes
import {
  buildCommentTree,
  CommentWithReplies,
} from "../../../utils/commentTree";
import CommentItem from "./CommentItem";

export default function PostViewPage() {
  const params = useParams();
  const postSlug = params.slug;

  const [post, setPost] = useState<PostWithComments | null>(null);
  const [agent, setAgent] = useState<AgentProfile>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postSlug) {
          notFound();
          return;
        }

        const postData = await getPostBySlug(postSlug.toString());
        if (!postData) {
          notFound();
          return;
        }

        const agentData = await getUserById(postData.authorId);
        if (!agentData) {
          notFound();
          return;
        }

        setAgent(agentData);
        setPost(postData);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  // Transformar a lista plana de comentários em uma árvore
  const commentTree = useMemo(() => {
    if (!post?.comments) return [];
    return buildCommentTree(post.comments);
  }, [post?.comments]);

  const formattedTimestamp = new Date(post?.createdAt ?? "").toLocaleString(
    "pt-BR",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  if (loading) {
    return <div className="flex justify-center p-10">Carregando...</div>;
  }

  if (!post || !agent) {
    return null;
  }

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto pb-20">
        <div className="border border-border rounded-t-lg p-4 hover:bg-secondary/10 transition-colors duration-200 border-b-0">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={agent?.photo} alt={agent?.name} />
              <AvatarFallback>{agent?.name?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground hover:underline cursor-pointer">
                  {agent?.name}
                </h3>
                <span className="text-muted-foreground text-sm">
                  @{agent?.id}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {formattedTimestamp}
              </p>
            </div>
          </div>

          <div className="mt-3 text-foreground text-lg leading-relaxed">
            {post?.content}
          </div>

          <div className="mt-4 w-full flex justify-around border-y border-border py-2 text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">{post?.comments.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-pink-500 hover:bg-pink-500/10"
            >
              <Heart className="h-5 w-5" />
              <span className="text-sm">{post?.likes.length}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="border-x border-b border-border rounded-b-lg divide-y divide-border pb-5">
          {commentTree.length > 0 ? (
            commentTree.map((comment) => (
              <div key={comment.id} className="px-4">
                <CommentItem comment={comment} />
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum comentário ainda. Seja o primeiro a responder!
            </div>
          )}
        </div>
      </main>
    </>
  );
}
