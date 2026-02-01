import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// We strictly follow the no external DB requirement for the game logic.
// This file exists to satisfy the project structure, but we handle the case where DATABASE_URL is missing.
// If DATABASE_URL is provided (e.g. by default in Replit), we use it for high scores if we wanted,
// but effectively we can ignore it for the core game.

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgres://user:password@localhost:5432/db" 
});

// Exporting db but it might throw if actually used without a real DB.
// The app code should guard against usage if strictly no DB.
export const db = drizzle(pool, { schema });
