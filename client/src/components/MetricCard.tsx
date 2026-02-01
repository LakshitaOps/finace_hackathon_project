import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "success" | "warning" | "danger";
  subValue?: string;
  className?: string;
}

export function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  color = "default", 
  subValue,
  className 
}: MetricCardProps) {
  
  const colorMap = {
    default: "text-foreground",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400",
  };

  const bgMap = {
    default: "bg-white/5",
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    danger: "bg-red-500/10 border-red-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden group",
        bgMap[color],
        className
      )}
    >
      <div className="flex justify-between items-start mb-2 z-10">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={cn("p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors", colorMap[color])}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="space-y-1 z-10">
        <h3 className={cn("text-2xl lg:text-3xl font-bold tracking-tight font-display", colorMap[color])}>
          {value}
        </h3>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>

      {/* Decorative gradient blob */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 pointer-events-none",
        color === 'success' ? 'bg-emerald-500' : 
        color === 'danger' ? 'bg-red-500' : 
        color === 'warning' ? 'bg-amber-500' : 'bg-primary'
      )} />
    </motion.div>
  );
}
