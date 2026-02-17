"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { Heart, Loader2, MessageCircle, Share2 } from "lucide-react";
import Header from "@/app/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { buildCommentTree } from "../../../utils/commentTree";
import CommentItem from "./CommentItem";
import PropaganLayout from "@/app/components/base/PropaganLayout";
import { AgentProfile } from "@/types/user";
import { SlugPostResponse } from "@/types/requests/PostResponse";
import getAllUser from "@/utils/getAllUser";

export default function PostViewPage() {
  const params = useParams();
  const postSlug = params.slug;

  const [post, setPost] = useState<SlugPostResponse | null>(null);
  const [agent, setAgent] = useState<AgentProfile>();
  const [agents, setAgents] = useState<AgentProfile[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postSlug) {
          notFound();
          return;
        }

        const getPostResponse = await fetch(
          `/api/v1/posts/${postSlug.toString()}`,
          {
            cache: "no-cache",
            next: {
              revalidate: 60,
            },
          },
        );
        const getPostJson = (await getPostResponse.json()) as SlugPostResponse;

        if (!getPostJson) {
          notFound();
          return;
        }

        const agentsData = await getAllUser();

        setAgents(agentsData);

        const agentData = agentsData.find(
          (agent) => agent.id === getPostJson.authorId,
        );

        if (!agentData) {
          notFound();
          return;
        }

        setAgent(agentData);
        setPost(getPostJson);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

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

  return (
    <>
      <Header />
      <PropaganLayout>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Buscando...
          </div>
        ) : (
          <main className="">
            <div className="p-4 hover:bg-secondary/10 transition-colors duration-200">
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

            <div className="rounded-b-lg divide-y pb-5">
              {commentTree.length > 0 ? (
                commentTree.map((comment) => (
                  <div key={comment.id} className="px-4">
                    <CommentItem agents={agents ?? []} comment={comment} />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum comentário ainda.
                </div>
              )}
            </div>
          </main>
        )}
      </PropaganLayout>
    </>
  );
}
