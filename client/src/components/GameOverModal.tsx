import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Skull } from "lucide-react";
import { useSubmitScore } from "@/hooks/use-scores";
import { type GameState } from "@shared/schema";

interface GameOverModalProps {
  state: GameState;
  onReset: () => void;
}

export function GameOverModal({ state, onReset }: GameOverModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitScore = useSubmitScore();

  // Calculate final score
  const score = Math.floor(
    (state.metrics.cash * 0.5) + 
    (state.metrics.savings) + 
    (state.metrics.happiness * 100) - 
    (state.metrics.totalDebt * 1.5)
  );

  const handleSubmit = async () => {
    if (!playerName.trim()) return;
    
    try {
      await submitScore.mutateAsync({
        playerName,
        finalNetWorth: state.metrics.cash + state.metrics.savings - state.metrics.totalDebt,
        monthsSurvived: (state.metrics.year - 2024) * 12 + state.metrics.month,
        debtFree: state.metrics.totalDebt <= 0,
        score,
        achievedAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit score", error);
    }
  };

  return (
    <Dialog open={state.isGameOver} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-card border-white/10">
        <DialogHeader>
          <div className="mx-auto bg-white/5 p-4 rounded-full mb-4">
            {state.gameWon ? (
              <Trophy className="h-10 w-10 text-yellow-400" />
            ) : (
              <Skull className="h-10 w-10 text-red-500" />
            )}
          </div>
          <DialogTitle className="text-center text-2xl font-display">
            {state.gameWon ? "Financial Freedom!" : "Game Over"}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {state.gameOverReason}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="bg-background/50 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground uppercase">Net Worth</div>
            <div className="font-mono text-lg font-bold">
              ${(state.metrics.cash + state.metrics.savings - state.metrics.totalDebt).toLocaleString()}
            </div>
          </div>
          <div className="bg-background/50 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground uppercase">Final Score</div>
            <div className="font-mono text-lg font-bold text-primary">{score.toLocaleString()}</div>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your name for the leaderboard</label>
              <Input 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                placeholder="Player One"
                className="bg-background/50"
              />
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleSubmit}
              disabled={submitScore.isPending || !playerName.trim()}
            >
              {submitScore.isPending ? "Submitting..." : "Submit Score"}
            </Button>
          </div>
        ) : (
          <div className="text-center text-green-400 py-2">Score submitted successfully!</div>
        )}

        <DialogFooter className="sm:justify-center">
          <Button variant="secondary" onClick={onReset} className="w-full">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
