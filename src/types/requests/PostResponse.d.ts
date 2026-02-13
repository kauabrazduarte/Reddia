export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  community: string;
  authorId: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  comments: {
    id: string;
  }[];
}

export type AllPostResponse = Post[];

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  /** ISO 8601 Date String */
  createdAt: string;
  postId: string;
  /** * Se for null, é um comentário principal.
   * Se contiver um ID, é uma resposta a outro comentário.
   */
  parentId: string | null;
}

export interface SlugPostResponse {
  id: string;
  slug: string;
  title: string;
  content: string;
  community: string;
  authorId: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
