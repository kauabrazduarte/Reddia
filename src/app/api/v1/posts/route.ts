import database from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("pages") ?? 0);

  if (!Number.isInteger(page)) {
    return NextResponse.json(
      { error: "pages parameter must be a number" },
      { status: 404 },
    );
  }

  const pageSize = 10;
  const posts = await database.post.findMany({
    skip: page * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      comments: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}
