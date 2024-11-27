import { z } from 'zod';

export const InsightSchema = z.object({
  source: z.string(),
  headline: z.string(),
  summary: z.string(),
  publishedAt: z.string().optional(), // ISO string format
});

export const ArticleDataSchema = z.object({
  url: z.string(),
  h1: z.string(),
  text: z.array(z.string()),
});

export type ArticleData = z.infer<typeof ArticleDataSchema>;
export type Insight = z.infer<typeof InsightSchema>;