import database from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("pages") ?? 0);

  const search = searchParams.get("search");

  if (!Number.isInteger(page)) {
    return NextResponse.json(
      { error: "pages parameter must be a number" },
      { status: 404 },
    );
  }

  const where: Record<string, unknown> = {};

  if (search) {
    const conditions: Record<string, unknown>[] = [
      { slug: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];

    const parsedId = Number(search);
    if (Number.isInteger(parsedId)) {
      conditions.push({ id: parsedId });
    }

    where.OR = conditions;
  }

  const pageSize = 7;
  const posts = await database.post.findMany({
    where,
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
