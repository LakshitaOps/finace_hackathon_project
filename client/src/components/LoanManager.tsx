import { useState } from "react";
import { type Loan } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DollarSign, CreditCard, CalendarClock, Percent } from "lucide-react";

interface LoanManagerProps {
  loans: Loan[];
  cash: number;
  onPay: (loanId: string, amount: number) => void;
}

export function LoanManager({ loans, cash, onPay }: LoanManagerProps) {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [payAmount, setPayAmount] = useState<string>("");

  const handlePay = () => {
    if (!selectedLoan) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;
    onPay(selectedLoan.id, amount);
    setPayAmount("");
    setSelectedLoan(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <CreditCard className="text-primary" /> Active Debts
      </h3>
      
      {loans.length === 0 ? (
        <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-muted-foreground bg-white/5">
          <p>You are debt free! Great job.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map((loan) => (
            <div key={loan.id} className="glass-card rounded-xl p-4 border border-white/5 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg">{loan.name}</h4>
                  <p className="text-xs text-muted-foreground">ID: {loan.id}</p>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-display font-bold text-red-400">
                    ${loan.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-muted-foreground">Remaining Principal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Percent size={14} /> {(loan.interestRate * 100).toFixed(1)}% APR
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock size={14} /> {loan.remainingMonths} months left
                </div>
                <div className="col-span-2 flex items-center gap-2 text-yellow-400/80 mt-1">
                  <DollarSign size={14} /> ${loan.monthlyPayment.toFixed(2)} / month
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setSelectedLoan(loan)}
                  >
                    Make Extra Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Pay off {loan.name}</DialogTitle>
                    <DialogDescription>
                      Making extra payments reduces your principal and total interest paid.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-9"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          max={Math.min(cash, loan.principal)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available Cash: ${cash.toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handlePay}
                      disabled={!payAmount || parseFloat(payAmount) > cash || parseFloat(payAmount) <= 0}
                    >
                      Confirm Payment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
