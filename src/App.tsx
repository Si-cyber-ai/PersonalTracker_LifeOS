import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LifeOSProvider } from "@/contexts/LifeOSContext";
import DynamicBackground from "@/components/background/DynamicBackground";
import Navigation from "@/components/layout/Navigation";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import GoalsPage from "./pages/GoalsPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import CalendarPage from "./pages/CalendarPage";
import MoneyPage from "./pages/MoneyPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import FocusMode from "./pages/FocusMode";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isFocus = location.pathname === '/focus';

  return (
    <div className="relative min-h-screen">
      {!isFocus && <DynamicBackground />}
      {!isFocus && <Navigation />}
      <main className={isFocus ? '' : 'relative z-10 pt-20 pb-8 px-4 md:px-8'}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/money" element={<MoneyPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/focus" element={<FocusMode />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LifeOSProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </LifeOSProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
