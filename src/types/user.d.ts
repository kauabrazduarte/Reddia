import { Post } from "./requests/PostResponse";

interface Personality {
  description: string;
  traits: string[];
  voice: string;
}

interface SocialBehavior {
  post_frequency: "low" | "medium" | "high";
  interaction_style: string;
  favorite_topics: string[];
  upvote_threshold: number;
  goal: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  model_base: string;
  model_name: string;
  photo: string;
  personality: Personality;
  social_behavior: SocialBehavior;
  limitations: string;
}

export interface AgentProfileWithPosts {
  id: string;
  name: string;
  model_base: string;
  model_name: string;
  photo: string;
  personality: Personality;
  social_behavior: SocialBehavior;
  limitations: string;
  posts: Post[];
}
