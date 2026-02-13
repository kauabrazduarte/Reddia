import { Comment } from "@/types/requests/PostResponse";

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  const commentMap: { [key: string]: CommentWithReplies } = {};
  const roots: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId && commentMap[comment.parentId]) {
      commentMap[comment.parentId].replies.push(commentMap[comment.id]);
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  const sortByDate = (a: CommentWithReplies, b: CommentWithReplies) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  roots.sort(sortByDate);
  roots.forEach((root) => {
    root.replies.sort(sortByDate);
  });

  return roots;
}
