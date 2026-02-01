import { useState, useEffect, useCallback, useReducer } from 'react';
import { type FinancialMetrics, type Loan, type GameState } from '@shared/schema';
import { useToast } from './use-toast';

// --- Game Constants & Config ---
const INITIAL_METRICS: FinancialMetrics = {
  cash: 2000,
  monthlyIncome: 3000,
  monthlyExpenses: 2000, // Rent, food, etc.
  totalDebt: 15000, // Student loans, etc.
  savings: 500,
  creditScore: 650,
  happiness: 80,
  stress: 20,
  month: 1,
  year: 2024,
};

const INITIAL_LOANS: Loan[] = [
  {
    id: 'student_loan',
    name: 'Student Loan',
    principal: 15000,
    interestRate: 0.05, // 5% APR
    monthlyPayment: 200,
    remainingMonths: 120,
  }
];

// --- Types ---
type GameAction = 
  | { type: 'NEXT_MONTH' }
  | { type: 'MAKE_DECISION', payload: { cost: number; happinessChange: number; stressChange: number; healthChange?: number } }
  | { type: 'TAKE_LOAN', payload: Loan }
  | { type: 'PAY_LOAN', payload: { loanId: string; amount: number } }
  | { type: 'RESET_GAME' }
  | { type: 'APPLY_EVENT', payload: { title: string; description: string; impact: Partial<FinancialMetrics> } };

// --- Random Event Engine ---
const EVENTS = [
  { title: "Car Breakdown", description: "Your transmission failed.", impact: { cash: -800, stress: 15, happiness: -10 } },
  { title: "Medical Emergency", description: "Unexpected trip to the ER.", impact: { cash: -500, stress: 20, happiness: -5 } },
  { title: "Found $100", description: "Lucky day!", impact: { cash: 100, happiness: 5 } },
  { title: "Rent Increase", description: "Landlord raised the rent.", impact: { monthlyExpenses: 200, stress: 10 } },
  { title: "Promotion!", description: "Hard work pays off.", impact: { monthlyIncome: 500, happiness: 20, stress: -5 } },
  { title: "Identity Theft", description: "Someone opened a card in your name.", impact: { creditScore: -50, stress: 30 } },
  { title: "Market Crash", description: "Your savings took a hit.", impact: { savings: -200, stress: 10 } }, // Simplified logic handles percentage elsewhere if needed
];

function getRandomEvent() {
  const roll = Math.random();
  if (roll > 0.3) return null; // 70% chance of nothing happening
  return EVENTS[Math.floor(Math.random() * EVENTS.length)];
}

// --- Reducer Logic ---
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEXT_MONTH': {
      let { metrics, loans, history } = state;
      
      // 1. Process Loans (Interest & Payments)
      let newLoans = loans.map(loan => {
        const monthlyRate = loan.interestRate / 12;
        const interest = loan.principal * monthlyRate;
        const principalPayment = Math.max(0, loan.monthlyPayment - interest);
        
        let newPrincipal = loan.principal;
        
        // Only reduce principal if we have cash (simplified: payments are auto-deducted from cash next step)
        // In this model, we assume mandatory payments are part of monthly expenses or handled separately.
        // Let's assume loan.monthlyPayment is MANDATORY and deducted from cash.
        
        newPrincipal = loan.principal - principalPayment;
        
        if (newPrincipal <= 0) return null; // Loan paid off
        
        return {
          ...loan,
          principal: newPrincipal,
          remainingMonths: loan.remainingMonths - 1
        };
      }).filter(Boolean) as Loan[];

      // 2. Financial Calculations
      const totalLoanPayments = loans.reduce((sum, l) => sum + l.monthlyPayment, 0);
      const netIncome = metrics.monthlyIncome - metrics.monthlyExpenses - totalLoanPayments;
      
      let newCash = metrics.cash + netIncome;
      let newTotalDebt = newLoans.reduce((sum, l) => sum + l.principal, 0);
      
      // Interest on Savings (small yield)
      const newSavings = metrics.savings * 1.002; // 0.2% monthly ~ 2.4% APY

      // 3. Stats Decay/Growth
      let newHappiness = metrics.happiness;
      let newStress = metrics.stress;
      let newCreditScore = metrics.creditScore;

      // Stress increases if cash is low or debt is high
      if (newCash < 500) newStress += 5;
      if (newTotalDebt > metrics.monthlyIncome * 6) newStress += 2;
      
      // Happiness decreases with high stress
      if (newStress > 80) newHappiness -= 5;
      if (newCash > 5000) newHappiness += 2;

      // Credit Score Logic (Simplified)
      if (newCash < 0) newCreditScore -= 20; // Missed payments implied
      else if (newTotalDebt < metrics.totalDebt) newCreditScore += 2; // Paying down debt
      
      // Clamp values
      newHappiness = Math.min(100, Math.max(0, newHappiness));
      newStress = Math.min(100, Math.max(0, newStress));
      newCreditScore = Math.min(850, Math.max(300, newCreditScore));

      // 4. Time Progression
      let newMonth = metrics.month + 1;
      let newYear = metrics.year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      // 5. Win/Loss Check
      const isBankrupt = newCash < -1000; // Allow small overdraft
      const isBurnout = newStress >= 100;
      const isDebtFree = newTotalDebt <= 0 && newCash > 0;
      const timeUp = (newYear - 2024) * 12 + newMonth > 60; // 5 years max

      let gameOverReason = undefined;
      let isGameOver = false;
      let gameWon = false;

      if (isBankrupt) {
        isGameOver = true;
        gameOverReason = "Bankruptcy: You ran out of money.";
      } else if (isBurnout) {
        isGameOver = true;
        gameOverReason = "Burnout: Stress levels became unmanageable.";
      } else if (isDebtFree && newSavings > 10000) {
        isGameOver = true;
        gameWon = true;
        gameOverReason = "Financial Freedom Achieved!";
      } else if (timeUp) {
        isGameOver = true;
        gameOverReason = "Time's Up: You didn't reach financial freedom in time.";
      }

      const newMetrics = {
        ...metrics,
        cash: newCash,
        totalDebt: newTotalDebt,
        savings: newSavings,
        happiness: newHappiness,
        stress: newStress,
        creditScore: newCreditScore,
        month: newMonth,
        year: newYear,
      };

      return {
        ...state,
        metrics: newMetrics,
        loans: newLoans,
        history: [...history, { month: (newYear - 2024) * 12 + newMonth, cash: newCash, netWorth: newCash + newSavings - newTotalDebt }],
        isGameOver,
        gameWon,
        gameOverReason,
      };
    }

    case 'APPLY_EVENT': {
      const { impact } = action.payload;
      const newMetrics = { ...state.metrics };
      
      if (impact.cash) newMetrics.cash += impact.cash;
      if (impact.monthlyExpenses) newMetrics.monthlyExpenses += impact.monthlyExpenses;
      if (impact.monthlyIncome) newMetrics.monthlyIncome += impact.monthlyIncome;
      if (impact.happiness) newMetrics.happiness = Math.min(100, Math.max(0, newMetrics.happiness + impact.happiness));
      if (impact.stress) newMetrics.stress = Math.min(100, Math.max(0, newMetrics.stress + impact.stress));
      if (impact.creditScore) newMetrics.creditScore = Math.min(850, Math.max(300, newMetrics.creditScore + impact.creditScore));
      if (impact.savings) newMetrics.savings += impact.savings;

      return { ...state, metrics: newMetrics };
    }

    case 'PAY_LOAN': {
      const { loanId, amount } = action.payload;
      if (state.metrics.cash < amount) return state; // Can't afford

      const newLoans = state.loans.map(l => {
        if (l.id !== loanId) return l;
        const newPrincipal = Math.max(0, l.principal - amount);
        return { ...l, principal: newPrincipal };
      }).filter(l => l.principal > 0);

      return {
        ...state,
        metrics: {
          ...state.metrics,
          cash: state.metrics.cash - amount,
          totalDebt: newLoans.reduce((sum, l) => sum + l.principal, 0),
        },
        loans: newLoans,
      };
    }

    case 'RESET_GAME':
      return {
        metrics: INITIAL_METRICS,
        loans: INITIAL_LOANS,
        isGameOver: false,
        gameWon: false,
        history: [],
      };

    default:
      return state;
  }
}

// --- Hook Export ---
export function useGameEngine() {
  const { toast } = useToast();
  
  // Initialize state from session storage or defaults
  const [state, dispatch] = useReducer(gameReducer, {
    metrics: INITIAL_METRICS,
    loans: INITIAL_LOANS,
    isGameOver: false,
    gameWon: false,
    history: [],
  }, (initial) => {
    const saved = sessionStorage.getItem('debtTrapGameState');
    return saved ? JSON.parse(saved) : initial;
  });

  // Persist state
  useEffect(() => {
    sessionStorage.setItem('debtTrapGameState', JSON.stringify(state));
  }, [state]);

  const nextMonth = useCallback(() => {
    dispatch({ type: 'NEXT_MONTH' });
    
    // Trigger random event AFTER the month update logic
    const event = getRandomEvent();
    if (event) {
      dispatch({ type: 'APPLY_EVENT', payload: event });
      toast({
        title: event.title,
        description: event.description,
        variant: event.impact.stress && event.impact.stress > 0 ? "destructive" : "default",
      });
    }
  }, [toast]);

  const payLoan = useCallback((loanId: string, amount: number) => {
    dispatch({ type: 'PAY_LOAN', payload: { loanId, amount } });
    toast({ title: "Payment Made", description: `$${amount} paid towards principal.` });
  }, [toast]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
    toast({ title: "New Game Started", description: "Good luck!" });
  }, [toast]);

  return {
    state,
    nextMonth,
    payLoan,
    resetGame
  };
}
