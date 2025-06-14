
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Colleges from "./pages/Colleges";
import CollegeDetails from "./pages/CollegeDetails";
import Predictor from "./pages/Predictor";
import CollegePredictor from "./pages/CollegePredictor";
import News from "./pages/News";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import Processing from "./pages/Processing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth pages without layout */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/processing" element={<Processing />} />
          
          {/* Pages with layout */}
          <Route path="/home" element={<Layout><Home /></Layout>} />
          <Route path="/colleges" element={<Layout><Colleges /></Layout>} />
          <Route path="/college-details/:id" element={<Layout><CollegeDetails /></Layout>} />
          <Route path="/predictor" element={<Layout><Predictor /></Layout>} />
          <Route path="/college-predictor" element={<Layout><CollegePredictor /></Layout>} />
          <Route path="/news" element={<Layout><News /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/profile-page" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
