import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface CommentProps {
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
}

export function Comment({
  authorName,
  authorHandle,
  authorAvatar,
  content,
  timestamp,
}: CommentProps) {
  const formattedTimestamp = new Date(timestamp).toLocaleString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-2 hover:bg-secondary/30 transition-colors duration-200">
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
    </div>
  );
}
