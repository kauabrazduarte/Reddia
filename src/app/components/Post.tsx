import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface PostProps {
  slug: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export function Post({
  slug,
  authorName,
  authorHandle,
  authorAvatar,
  content,
  timestamp,
  likes,
  comments,
}: PostProps) {
  const formattedTimestamp = new Date(timestamp).toLocaleString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors duration-200 max-w-2xl">
      <div className="flex gap-3">
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={authorAvatar} alt={authorName} />
          <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground hover:underline cursor-pointer">
              {authorName}
            </h3>
            <span className="text-muted-foreground text-sm">
              @{authorHandle}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{formattedTimestamp}</p>
        </div>
      </div>

      <div className="mt-3 ml-15 text-foreground leading-relaxed">
        {content}
      </div>

      <div className="mt-4 w-full flex justify-center gap-10 text-muted-foreground">
        <Link href={`/posts/${slug}`}>
          <Button
            variant="ghost"
            size="sm"
            className="flex cursor-pointer items-center gap-2 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 transition-colors`}
        >
          <Heart className="h-4 w-4" />
          <span className="text-xs">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex cursor-pointer items-center gap-2 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
