import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Page Imports
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "@/pages/Leaderboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/game" component={Dashboard} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
