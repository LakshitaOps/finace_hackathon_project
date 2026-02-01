import { z } from 'zod';
import { insertGameScoreSchema, gameScores } from './schema';

// Minimal API for leaderboard (optional, can be client-only too if strictly no-backend)
// We will keep it defined but optional in implementation
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scores: {
    list: {
      method: 'GET' as const,
      path: '/api/scores',
      responses: {
        200: z.array(z.custom<typeof gameScores.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scores',
      input: insertGameScoreSchema,
      responses: {
        201: z.custom<typeof gameScores.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
