import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// While we aren't using a DB, we define the shapes here for consistency
export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  finalNetWorth: integer("final_net_worth").notNull(),
  monthsSurvived: integer("months_survived").notNull(),
  debtFree: boolean("debt_free").notNull(),
  score: integer("score").notNull(),
  achievedAt: text("achieved_at").notNull(),
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({ id: true });
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;

// Game State Types for the Client
export const financialMetricsSchema = z.object({
  cash: z.number(),
  monthlyIncome: z.number(),
  monthlyExpenses: z.number(),
  totalDebt: z.number(),
  savings: z.number(),
  creditScore: z.number().min(300).max(850),
  happiness: z.number().min(0).max(100),
  stress: z.number().min(0).max(100),
  month: z.number(),
  year: z.number(),
});

export type FinancialMetrics = z.infer<typeof financialMetricsSchema>;

export const loanSchema = z.object({
  id: z.string(),
  name: z.string(),
  principal: z.number(),
  interestRate: z.number(), // Annual percentage
  monthlyPayment: z.number(),
  remainingMonths: z.number(),
});

export type Loan = z.infer<typeof loanSchema>;

export const gameStateSchema = z.object({
  metrics: financialMetricsSchema,
  loans: z.array(loanSchema),
  isGameOver: z.boolean(),
  gameWon: z.boolean(),
  gameOverReason: z.string().optional(),
  history: z.array(z.object({
    month: z.number(),
    cash: z.number(),
    netWorth: z.number(),
  })),
});

export type GameState = z.infer<typeof gameStateSchema>;
