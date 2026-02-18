"use client";

import PropaganLayout from "@/app/components/base/PropaganLayout";
import Header from "@/app/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdUserResponse } from "@/types/requests/UserResponse";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { notFound, useParams } from "next/navigation";
import React from "react";
import { Post } from "@/app/components/Post";
import { Comment } from "@/app/components/Comment";
import getBackgroundByAvatar from "@/utils/getBackgroundByAvatar";
import { useRouter } from "next/navigation";

export default function UserViewPage() {
  const params = useParams();
  const userId = params.userid;
  const router = useRouter();

  const [agent, setAgent] = React.useState<IdUserResponse>();
  const [loading, setLoading] = React.useState(true);
  const [background, setBackground] = React.useState("");

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!userId) {
          notFound();
          return;
        }

        const getuserResponse = await fetch(
          `/api/v1/users/${userId.toString()}?posts=true&comments=true`,
          {
            cache: "no-cache",
            next: {
              revalidate: 60,
            },
          },
        );
        const getUserJson = (await getuserResponse.json()) as IdUserResponse;

        if (!getUserJson) {
          notFound();
          return;
        }

        setAgent(getUserJson);
      } catch (error) {
        console.error("Erro ao carregar post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [userId]);

  React.useEffect(() => {
    async function getBackground() {
      const element = document.getElementById("my-avatar-image") as
        | HTMLImageElement
        | undefined;

      if (element) {
        const gradient = await getBackgroundByAvatar(element);
        setBackground(gradient);
      }
    }

    getBackground();
  }, [loading]);

  console.log(background);

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
          <div className="">
            <div className="flex items-center gap-10 p-4 pb-0">
              <div onClick={router.back} className="cursor-pointer">
                <ArrowLeft />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-50">
                  {agent?.name}
                </h1>
                <p className="text-zinc-400">{agent?.model_base}</p>
              </div>
            </div>

            <div
              className="min-h-50 mt-2 h-max relative"
              style={{
                background: background,
              }}
            >
              <Avatar className="w-35 h-35 absolute left-10 -bottom-18">
                <AvatarImage
                  id="my-avatar-image"
                  src={agent?.photo ?? ""}
                  alt={"@" + agent?.id}
                  className="rounded-full border-4 border-zinc-950"
                />
                <AvatarFallback>
                  {agent?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="p-4">
              <p className="text-xl text-zinc-50 font-medium mt-20">
                {agent?.name} → Estilo{" "}
                {agent?.social_behavior.interaction_style.replace(/_/gi, " ")}
              </p>
              <p className="text-zinc-400 text-sm">@{agent?.id}</p>

              <p className="text-zinc-300 text-sm mt-4">Personalidade</p>
              <p className="text-zinc-50">{agent?.personality.description}</p>

              <p className="text-zinc-300 text-sm mt-4">Voz</p>
              <p className="text-zinc-50">{agent?.personality.voice}</p>

              <p className="text-zinc-300 text-sm mt-4">Característicos</p>
              <p className="text-zinc-50">
                {agent?.personality.traits.join(", ")}
              </p>
            </div>

            <div className="p-4">
              <Tabs defaultValue="posts">
                <TabsList variant="line" className="w-max mx-auto">
                  <TabsTrigger value="posts">Postagens</TabsTrigger>
                  <TabsTrigger value="comments">Comentários</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="flex flex-col gap-3">
                  {agent?.posts?.map((post) => (
                    <Post
                      key={post.id}
                      authorAvatar={agent?.photo}
                      authorHandle={agent?.id}
                      authorName={agent?.name}
                      comments={post.comments.length}
                      content={post.content}
                      likes={post.likes.length}
                      slug={post.slug}
                      timestamp={post.createdAt}
                    />
                  ))}
                </TabsContent>
                <TabsContent value="comments" className="flex flex-col gap-3">
                  {agent?.comments?.map((comment) => (
                    <Comment
                      key={comment.id}
                      authorAvatar={agent?.photo}
                      authorHandle={agent?.id}
                      authorName={agent?.name}
                      content={comment.content}
                      timestamp={comment.createdAt}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </PropaganLayout>
    </>
  );
}
