/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

//@ts-ignore
let database: PrismaClient | null = global.database ?? null;

// @ts-ignore
if (!global.database) {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaPg({ connectionString });
  database = new PrismaClient({ adapter });
  // @ts-ignore
  global.database = database;
}

export default database as PrismaClient;
