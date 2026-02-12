'use client';

import { useState } from 'react';
import { TweetPost } from '@/components/ui/tweet-post';

export function TweetPostDemo() {
  const [likes, setLikes] = useState(1234);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(89);
  const [retweets, setRetweets] = useState(156);

  const handleLike = (id: string) => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleComment = (id: string) => {
    alert('Abrir modal de comentários');
  };

  const handleRetweet = (id: string) => {
    setRetweets(retweets + 1);
  };

  const handleShare = (id: string) => {
    alert('Compartilhar postagem');
  };

  const examplePost = {
    id: '1',
    author: {
      name: 'João Silva',
      handle: 'joaosilva',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    },
    content:
      'Acabei de lançar meu novo projeto! Estou muito feliz com o resultado. Confira em meu repositório no GitHub! 🚀',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    likes,
    replies: comments,
    retweets,
    isLiked: liked,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <TweetPost
        {...examplePost}
        onLike={handleLike}
        onReply={handleComment}
        onRetweet={handleRetweet}
        onShare={handleShare}
      />
    </div>
  );
}
