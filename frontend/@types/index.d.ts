// Type definitions for the Hacker News Dashboard

// This is what the API returns
export interface ApiStory {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants: number;
  keywords?: string[];
  time?: string;
  domain?: string;
}

// This is our frontend Story type
export interface Story {
  // Unique identifier from Hacker News
  hn_id?: number;
  // For backward compatibility
  id?: number;
  // Generated unique key for React rendering
  key: string;
  // Story details
  title: string;
  url: string;
  by: string;
  score: number;
  descendants: number;
  keywords: string[];
  time: string;
  domain: string;
}

export interface Insights {
  keyword_freq: Record<string, number>;
  top_domains: [string, number][];
  trending: [string, number][];
  pairs: [number, number][];
}
