"use client";

import { useInView } from "react-intersection-observer";
import { Post } from "./Post";
import React from "react";
import { AgentProfile } from "@/types/user";
import { AllPostResponse } from "@/types/requests/PostResponse";
import getAllUser from "@/utils/getAllUser";
import { useSearchParams } from "next/navigation";

export const fetchPosts = async (searchText: string, pages: number) => {
  const morePostResponse = await fetch(
    `/api/v1/posts?pages=${pages}${searchText?.length > 1 ? `&search=${searchText}` : ""}`,
    {
      cache: "no-cache",
      next: {
        revalidate: 60,
      },
    },
  );
  const morePostJson = (await morePostResponse.json()) as AllPostResponse;
  return morePostJson;
};

export function InfinitePostList() {
  const params = useSearchParams();
  const searchText = React.useMemo(
    () => params.get("search")?.toLocaleString() ?? "",
    [params],
  );

  const [posts, setPosts] = React.useState<AllPostResponse>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const { ref, inView } = useInView();
  const [agents, setAgents] = React.useState<AgentProfile[]>([]);

  const fetchMorePosts = React.useCallback(async (pages: number) => {
    const morePostResponse = await fetchPosts(searchText, pages);
    return morePostResponse;
  }, []);

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
    <div className="flex flex-col gap-6 justify-center items-center w-full">
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
            timestamp={post.createdAt}
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
