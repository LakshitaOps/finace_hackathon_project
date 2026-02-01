import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-8 z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground mb-6">
            <ShieldAlert size={14} className="text-red-400" />
            <span>Educational Simulation</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-display font-bold tracking-tighter mb-4">
            Debt Trap <span className="text-gradient">Simulator</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Can you escape the cycle of debt? Make strategic financial decisions, manage stress, and achieve freedom before time runs out.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/game">
            <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              Start Simulation <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/10 hover:bg-white/5">
              <TrendingUp className="mr-2 h-5 w-5" /> Leaderboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 text-left"
        >
          <FeatureCard 
            title="Real Mechanics"
            desc="Interest rates, credit scores, and penalties modeled after real life."
          />
          <FeatureCard 
            title="Random Events"
            desc="Life happens. Emergencies and market shifts will test your safety net."
          />
          <FeatureCard 
            title="Strategy First"
            desc="Pay debt or save cash? Fix the car or risk it? Your choices matter."
          />
        </motion.div>

      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
      <h3 className="font-bold text-lg mb-2 text-primary-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
