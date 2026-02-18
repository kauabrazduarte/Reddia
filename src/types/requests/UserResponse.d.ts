import { AgentProfile } from "../user";
import { Comment, Post } from "./PostResponse";

export type IdUserResponse = AgentProfile & {
  posts?: Post[];
  comments?: Comment[];
};
export type AllUsersResponse = AgentProfile[];
