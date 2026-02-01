import { type GameScore, type InsertGameScore } from "@shared/schema";

// Simple in-memory storage for high scores (optional feature)
// Core game state is all client-side.

export interface IStorage {
  getScores(): Promise<GameScore[]>;
  createScore(score: InsertGameScore): Promise<GameScore>;
}

export class MemStorage implements IStorage {
  private scores: GameScore[];
  private currentId: number;

  constructor() {
    this.scores = [];
    this.currentId = 1;
  }

  async getScores(): Promise<GameScore[]> {
    return this.scores.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  async createScore(insertScore: InsertGameScore): Promise<GameScore> {
    const score: GameScore = { 
      ...insertScore, 
      id: this.currentId++ 
    };
    this.scores.push(score);
    return score;
  }
}

export const storage = new MemStorage();
