"use client";

import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchPosts } from "./InfinitePostList";
import { AllPostResponse } from "@/types/requests/PostResponse";

export default function Header() {
  const [searchText, setSearchText] = React.useState("");
  const [results, setResults] = React.useState<AllPostResponse>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (value.length < 2) {
        setResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      timeoutRef.current = setTimeout(async () => {
        const posts = await fetchPosts(value, 0);
        setResults(posts);
        setIsSearching(false);
        setHasSearched(true);
      }, 2000);
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="px-[10vw] py-3 bg-zinc-950 z-10 w-full h-17 flex items-center fixed justify-between gap-20 border-b border-y-zinc-800">
        <Link href="/" className="text-zinc-200 text-xl font-bold">
          REDD<span className="text-orange-600">IA</span>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <div className="w-full max-w-sm space-y-2 cursor-pointer">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  disabled
                  className="bg-background pl-9"
                  id="search-input"
                  placeholder="Search..."
                  type="search"
                />
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Pesquisar</DialogTitle>
            </DialogHeader>

            <div className="max-w-sm space-y-4 w-[calc(100%-48px)]">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="bg-background pl-9"
                  placeholder="Search..."
                  type="search"
                  value={searchText}
                  onChange={handleSearchChange}
                  autoFocus
                />
              </div>

              {isSearching && (
                <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </div>
              )}

              {!isSearching && hasSearched && results.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum resultado encontrado.
                </p>
              )}

              {!isSearching && results.length > 0 && (
                <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {results.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="block rounded-lg border border-zinc-800 p-3 hover:bg-zinc-900 transition-colors"
                      >
                        <p className="font-medium text-sm truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {post.content}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </header>
      <div className="pt-17"></div>
    </>
  );
}
