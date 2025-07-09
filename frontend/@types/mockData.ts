import type { Insights, Story } from './index';

export const MOCK_INSIGHTS: Insights = {
  keyword_freq: { 'react': 150, 'typescript': 120, 'nextjs': 90, 'ai': 85, 'webdev': 75 },
  top_domains: [
    ['github.com', 45],
    ['youtube.com', 32],
    ['medium.com', 28],
    ['dev.to', 25],
    ['twitter.com', 20]
  ],
  trending: [
    ['ai', 150],
    ['typescript', 120],
    ['react', 90],
    ['nextjs', 85],
    ['webdev', 75]
  ],
  pairs: [
    [100, 50],
    [85, 45],
    [120, 60],
    [75, 30],
    [90, 40],
    [110, 55]
  ]
};

export const MOCK_STORIES: Story[] = Array(5).fill(0).map((_, i) => ({
  id: i + 1,
  title: `Sample Story ${i + 1} - This is a mock data story`,
  url: 'https://example.com',
  by: `user${i + 1}`,
  score: 100 - (i * 10),
  descendants: 50 - (i * 5),
  keywords: ['react', 'typescript', 'nextjs'].slice(0, (i % 3) + 1)
}));
