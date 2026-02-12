"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Header() {
  const websitePathname = usePathname();
  const [searchParams, setSearchParams] = React.useState("");

  const handleSearchFormSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      //
    },
    [],
  );

  return (
    <>
      <header className="px-[10vw] py-3 bg-zinc-950 flex items-center justify-between gap-20">
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

        <div className="flex items-center gap-7 max-lg:hidden">
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle({
                  className:
                    websitePathname === "/"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "",
                })}
              >
                <Link href="/">Relevantes</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>

          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle({
                  className:
                    websitePathname === "/recents"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "",
                })}
              >
                <Link href="/recents">Recentes</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        </div>
      </header>
      <div className="mb-10"></div>
    </>
  );
}
