
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/colleges" element={<Colleges />} />
          <Route path="/college-details/:id" element={<CollegeDetails />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/college-predictor" element={<CollegePredictor />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
