import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HistoryChartProps {
  data: Array<{ month: number; cash: number; netWorth: number }>;
}

export function HistoryChart({ data }: HistoryChartProps) {
  if (data.length < 2) return null;

  return (
    <Card className="glass-card border-none bg-black/20">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Net Worth History</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `M${val}`}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
