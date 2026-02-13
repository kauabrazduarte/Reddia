import database from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const postSlug = (await params).slug;

  const post = await database.post.findUnique({
    where: { slug: postSlug },
    include: {
      comments: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post Not Found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
