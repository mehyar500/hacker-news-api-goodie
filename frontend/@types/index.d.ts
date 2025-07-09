// Type definitions for the Hacker News Dashboard

export interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants: number;
  keywords: string[];
}

export interface Insights {
  keyword_freq: Record<string, number>;
  top_domains: [string, number][];
  trending: [string, number][];
  pairs: [number, number][];
}
