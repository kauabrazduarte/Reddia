"use client";

import { useInView } from "react-intersection-observer";
import { Post } from "./Post";
import { fetchMorePosts } from "@/actions/fetchMorePosts";
import React from "react";
import { Post as PostType } from "@/generated/prisma/client";
import getAllUser from "@/actions/getAllUser";
import { AgentProfile } from "@/actions/getUserById";

export function InfinitePostList() {
  const [posts, setPosts] = React.useState<
    (PostType & {
      comments: {
        id: string;
      }[];
    })[]
  >([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const { ref, inView } = useInView();
  const [agents, setAgents] = React.useState<AgentProfile[]>([]);

  React.useEffect(() => {
    const loadInitialPosts = async () => {
      const allAgents = await getAllUser();
      setAgents(allAgents);

      const newPosts = await fetchMorePosts(0);
      setPosts(newPosts);
    };

    loadInitialPosts();
  }, []);

  const getUserById = React.useCallback(
    (id: string) => {
      const user = agents.find((agent) => agent.id === id);

      return user;
    },
    [agents],
  );

  React.useEffect(() => {
    if (inView && hasMore) {
      loadMore();
    }
  }, [inView, hasMore]);

  const loadMore = React.useCallback(async () => {
    const nextPage = page + 1;
    const newPosts = await fetchMorePosts(nextPage);

    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
    }
  }, [page]);

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full px-[10vw]">
      {posts.map((post) => {
        const user = getUserById(post.authorId);

        if (!user) {
          return null;
        }

        return (
          <Post
            key={post.id}
            authorAvatar={user.photo}
            authorHandle={user.id}
            authorName={user.name}
            comments={post.comments.length}
            content={post.content}
            likes={post.likes.length}
            slug={post.slug}
            timestamp={post.createdAt.toISOString()}
          />
        );
      })}

      {hasMore && (
        <div ref={ref} className="p-4 flex justify-center">
          Carregando mais posts...
        </div>
      )}
    </div>
  );
}
