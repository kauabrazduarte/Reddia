import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TweetPostProps {
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes?: number;
  comments?: number;
  shares?: number;
  liked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function TweetPost({
  author,
  content,
  timestamp,
  likes = 0,
  comments = 0,
  shares = 0,
  liked = false,
  onLike,
  onComment,
  onShare,
}: TweetPostProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), {
    locale: ptBR,
    addSuffix: true,
  });

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
      {/* Header com avatar, nome e menu */}
      <div className="flex gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-bold hover:underline">{author.name}</span>
              <span className="text-gray-500 dark:text-gray-400">
                @{author.handle}
              </span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {timeAgo}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Conteúdo da postagem */}
          <p className="text-base text-black dark:text-white leading-normal mt-2">
            {content}
          </p>

          {/* Botões de interação */}
          <div className="mt-3 flex max-w-md gap-0 text-gray-500 dark:text-gray-600">
            {/* Comentários */}
            <div className="group flex flex-1 justify-start">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors"
                onClick={onComment}
              >
                <MessageCircle className="h-4 w-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 rounded-full p-2 w-8 h-8" />
                {comments > 0 && <span className="text-xs">{comments}</span>}
              </Button>
            </div>

            {/* Compartilhamentos */}
            <div className="group flex flex-1 justify-start">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500 transition-colors"
                onClick={onShare}
              >
                <Share className="h-4 w-4 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 rounded-full p-2 w-8 h-8" />
                {shares > 0 && <span className="text-xs">{shares}</span>}
              </Button>
            </div>

            {/* Likes */}
            <div className="group flex flex-1 justify-start">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 p-2 transition-colors ${
                  liked
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                }`}
                onClick={onLike}
              >
                <Heart
                  className={`h-4 w-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 rounded-full p-2 w-8 h-8 transition-colors ${
                    liked ? "fill-red-500" : ""
                  }`}
                />
                {likes > 0 && <span className="text-xs">{likes}</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Agora vou criar um exemplo de uso do componente:

<file_path>
reddia\src/components/tweet-post-demo.tsx
</file_path>

<edit_description>
Exemplo de uso do componente TweetPost
</edit_description>

```
"use client";

import { useState } from "react";
import { TweetPost } from "@/components/ui/tweet-post";

export function TweetPostDemo() {
  const [likes, setLikes] = useState(1234);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(89);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const examplePost = {
    author: {
      name: "João Silva",
      handle: "joaosilva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
    },
    content:
      "Acabei de lançar meu novo projeto! Estou muito feliz com o resultado. Confira em meu repositório no GitHub! 🚀",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    likes,
    comments,
    shares: 45,
    liked,
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <TweetPost
        {...examplePost}
        onLike={handleLike}
        onComment={() => alert("Abrir modal de comentários")}
        onShare={() => alert("Compartilhar postagem")}
      />
    </div>
  );
}
```

Perfeito! Criei um componente completo de postagem estilo Twitter com as seguintes funcionalidades:

## ✨ Características do Componente `TweetPost`:

### **Elementos Visuais:**
- ✅ **Avatar do autor** - com fallback automático
- ✅ **Nome e handle** do autor
- ✅ **Hora publicada** - formatada em português (ex: "há 2 horas")
- ✅ **Conteúdo da postagem**
- ✅ **Botão de menu** (três pontos)

### **Interações:**
- 💬 **Botão de Comentários** - mostra quantidade de comentários
- ❤️ **Botão de Likes** - com animação de preenchimento quando curtido, mostra quantidade
- 🔄 **Botão de Compartilhamentos** - com contador
- Cada botão tem seu próprio callback (`onLike`, `onComment`, `onShare`)

### **Estilos:**
- 🎨 **Dark mode support** completo
- ✨ **Hover effects** com cores específicas para cada ação
- 📱 **Totalmente responsivo**
- 🔄 **Transições suaves**

### **Props do Componente:**
```typescript
{
  author: { name, handle, avatar },
  content: string,
  timestamp: Date,
  likes?: number,
  comments?: number,
  shares?: number,
  liked?: boolean,
  onLike?: () => void,
  onComment?: () => void,
  onShare?: () => void
}
```

Você vai precisar instalar a biblioteca `date-fns` se não tiver:
```bash
npm install date-fns
# ou
bun add date-fns
```

Também precisará do componente `Avatar` do shadcn:
```bash
npx shadcn-ui@latest add avatar
