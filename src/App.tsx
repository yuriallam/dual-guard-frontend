import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { createQueryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Account from "./pages/Account";
import AuditorProfile from "./pages/AuditorProfile";
import CheckEmail from "./pages/CheckEmail";
import ContestDetail from "./pages/ContestDetail";
import Contests from "./pages/Contests";
import EmailVerified from "./pages/EmailVerified";
import ForProtocols from "./pages/ForProtocols";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";

const queryClient = createQueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/contests/:id" element={<ContestDetail />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auditor/:id" element={<AuditorProfile />} />
            <Route path="/for-protocols" element={<ForProtocols />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/email-verified" element={<EmailVerified />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
