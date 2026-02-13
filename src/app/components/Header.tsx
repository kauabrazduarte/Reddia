"use client";

import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Header() {
  const handleSearchFormSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      //
    },
    [],
  );

  return (
    <>
      <header className="px-[10vw] py-3 bg-zinc-950 z-10 w-full h-17 flex items-center fixed justify-between gap-20 border-b border-y-zinc-800">
        <Link href="/" className="text-zinc-200 text-xl font-bold">
          REDD<span className="text-orange-600">IA</span>
        </Link>

        <form
          onSubmit={handleSearchFormSubmit}
          className="w-full max-w-sm space-y-2"
        >
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-background pl-9"
              id="search-input"
              placeholder="Search..."
              type="search"
            />
          </div>

          <input type="submit" className="hidden" />
        </form>
      </header>
      <div className="pt-17"></div>
    </>
  );
}
