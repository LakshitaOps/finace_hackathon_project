import { useScores } from "@/hooks/use-scores";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { data: scores, isLoading } = useScores();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
              <ArrowLeft size={16} /> Back to Game
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Trophy /> Hall of Fame
          </div>
        </div>

        <div className="text-center space-y-2 mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50">
            Top Financial Strategists
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            These players successfully escaped the debt trap with the highest net worth and stability.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {scores?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No scores yet. Be the first to win!
              </div>
            ) : (
              scores?.sort((a: any, b: any) => b.score - a.score).map((score: any, index: number) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 sm:p-6 rounded-xl border border-white/5 flex items-center gap-4 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex-none w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/5 text-lg font-bold font-mono group-hover:bg-primary group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg truncate">{score.playerName}</h3>
                      {index === 0 && <Medal className="text-yellow-400 h-4 w-4" />}
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-4">
                      <span>{score.monthsSurvived} months</span>
                      <span>•</span>
                      <span className={score.debtFree ? "text-emerald-400" : "text-red-400"}>
                        {score.debtFree ? "Debt Free" : "In Debt"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-primary">
                      {score.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
