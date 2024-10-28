import { z } from 'zod';

export const InsightSchema = z.object({
  source: z.string(),
  headline: z.string(),
  summary: z.string(),
  publishedAt: z.string().optional(), // ISO string format
});

export type Insight = z.infer<typeof InsightSchema>;