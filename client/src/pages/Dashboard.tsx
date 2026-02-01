import { useGameEngine } from "@/hooks/use-game-engine";
import { MetricCard } from "@/components/MetricCard";
import { LoanManager } from "@/components/LoanManager";
import { HistoryChart } from "@/components/HistoryChart";
import { GameOverModal } from "@/components/GameOverModal";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Activity, 
  Smile, 
  BrainCircuit,
  ArrowRight,
  Landmark
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { state, nextMonth, payLoan, resetGame } = useGameEngine();
  const { metrics, loans, history } = state;

  // Derived state helpers
  const netWorth = metrics.cash + metrics.savings - metrics.totalDebt;
  const monthlyCashflow = metrics.monthlyIncome - metrics.monthlyExpenses - loans.reduce((sum, l) => sum + l.monthlyPayment, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* --- Top Sticky Stats Bar --- */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              {metrics.month}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Month {metrics.month}</h1>
              <p className="text-xs text-muted-foreground">{metrics.year}</p>
            </div>
          </div>

          <div className="flex gap-6 flex-1 justify-center max-w-2xl overflow-x-auto no-scrollbar">
            {/* Happiness */}
            <div className="flex flex-col gap-1 w-24">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Smile size={12} /> Happiness</span>
                <span>{Math.round(metrics.happiness)}%</span>
              </div>
              <Progress value={metrics.happiness} className="h-1.5 bg-white/10" indicatorClassName="bg-emerald-500" />
            </div>

            {/* Stress */}
            <div className="flex flex-col gap-1 w-24">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><BrainCircuit size={12} /> Stress</span>
                <span>{Math.round(metrics.stress)}%</span>
              </div>
              <Progress value={metrics.stress} className="h-1.5 bg-white/10" indicatorClassName="bg-red-500" />
            </div>

            {/* Credit Score */}
            <div className="flex flex-col gap-1 w-24">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Activity size={12} /> Score</span>
                <span>{Math.round(metrics.creditScore)}</span>
              </div>
              {/* Normalize 300-850 to 0-100 */}
              <Progress 
                value={((metrics.creditScore - 300) / 550) * 100} 
                className="h-1.5 bg-white/10" 
                indicatorClassName="bg-blue-500" 
              />
            </div>
          </div>

          <Button 
            onClick={nextMonth} 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
          >
            Next Month <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- Primary Metrics Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="Cash on Hand" 
            value={`$${metrics.cash.toLocaleString()}`} 
            icon={DollarSign} 
            color={metrics.cash < 500 ? "danger" : "default"}
          />
          <MetricCard 
            label="Total Debt" 
            value={`$${metrics.totalDebt.toLocaleString()}`} 
            icon={CreditCard} 
            color={metrics.totalDebt > 20000 ? "danger" : "warning"}
          />
          <MetricCard 
            label="Savings" 
            value={`$${metrics.savings.toLocaleString()}`} 
            icon={Landmark} 
            color="success"
          />
          <MetricCard 
            label="Net Worth" 
            value={`$${Math.round(netWorth).toLocaleString()}`} 
            icon={Wallet} 
            color={netWorth > 0 ? "success" : "default"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Main Content Left Column (2/3) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cashflow Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6 border border-white/5"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-primary h-6 w-6" />
                <h2 className="text-xl font-display font-bold">Monthly Cashflow</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Income</div>
                  <div className="text-xl font-bold text-emerald-400">+{metrics.monthlyIncome.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Expenses</div>
                  <div className="text-xl font-bold text-red-400">-{metrics.monthlyExpenses.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Loan Payments</div>
                  <div className="text-xl font-bold text-orange-400">
                    -{loans.reduce((sum, l) => sum + l.monthlyPayment, 0).toFixed(0)}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-muted-foreground">Net Monthly Change</span>
                <span className={cn("text-2xl font-bold font-mono", monthlyCashflow >= 0 ? "text-emerald-400" : "text-red-500")}>
                  {monthlyCashflow >= 0 ? "+" : ""}{monthlyCashflow.toFixed(0)}
                </span>
              </div>
            </motion.div>

            {/* Loan Manager Component */}
            <LoanManager loans={loans} cash={metrics.cash} onPay={payLoan} />

          </div>

          {/* --- Sidebar Right Column (1/3) --- */}
          <div className="space-y-8">
            {/* History Chart */}
            <HistoryChart data={history} />
            
            {/* Game Objective Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
              <h3 className="font-bold text-lg mb-3">Objective</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className={cn("mt-0.5 w-2 h-2 rounded-full", metrics.totalDebt <= 0 ? "bg-emerald-500" : "bg-white/20")} />
                  <span>Become debt free ($0 debt)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={cn("mt-0.5 w-2 h-2 rounded-full", metrics.savings > 10000 ? "bg-emerald-500" : "bg-white/20")} />
                  <span>Save $10,000 in the bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className={cn("mt-0.5 w-2 h-2 rounded-full", metrics.month + (metrics.year - 2024)*12 <= 60 ? "bg-emerald-500" : "bg-red-500")} />
                  <span>Within 5 years (60 months)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <GameOverModal state={state} onReset={resetGame} />
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
