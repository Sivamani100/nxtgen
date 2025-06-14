import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Routes without layout */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={navItems.find(item => item.to === "/login")?.page} />
          <Route path="/signup" element={navItems.find(item => item.to === "/signup")?.page} />
          <Route path="/forgot-password" element={navItems.find(item => item.to === "/forgot-password")?.page} />
          <Route path="/processing" element={navItems.find(item => item.to === "/processing")?.page} />
          
          {/* Routes with layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/home" element={navItems.find(item => item.to === "/home")?.page} />
                <Route path="/colleges" element={navItems.find(item => item.to === "/colleges")?.page} />
                <Route path="/predictor" element={navItems.find(item => item.to === "/predictor")?.page} />
                <Route path="/college-predictor" element={navItems.find(item => item.to === "/college-predictor")?.page} />
                <Route path="/college-details/:id" element={navItems.find(item => item.to === "/college-details/:id")?.page} />
                <Route path="/news" element={navItems.find(item => item.to === "/news")?.page} />
                <Route path="/compare" element={navItems.find(item => item.to === "/compare")?.page} />
                <Route path="/favorites" element={navItems.find(item => item.to === "/favorites")?.page} />
                <Route path="/notifications" element={navItems.find(item => item.to === "/notifications")?.page} />
                <Route path="/profile" element={navItems.find(item => item.to === "/profile")?.page} />
                <Route path="/search" element={navItems.find(item => item.to === "/search")?.page} />
                <Route path="/privacy-policy" element={navItems.find(item => item.to === "/privacy-policy")?.page} />
                <Route path="/help" element={navItems.find(item => item.to === "/help")?.page} />
                <Route path="*" element={navItems.find(item => item.to === "/404")?.page} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
