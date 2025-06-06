
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Processing from "./pages/Processing";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Favorites from "./pages/Favorites";
import News from "./pages/News";
import ProfilePage from "./pages/ProfilePage";
import Predictor from "./pages/Predictor";
import Colleges from "./pages/Colleges";
import CollegeDetails from "./pages/CollegeDetails";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/*"
            element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  {/* Desktop Sidebar - hidden on mobile */}
                  <div className="hidden md:block">
                    <AppSidebar />
                  </div>
                  
                  <SidebarInset className="flex-1">
                    {/* Desktop Header with Sidebar Trigger */}
                    <header className="hidden md:flex h-16 items-center border-b border-gray-200 px-4 bg-white">
                      <SidebarTrigger className="mr-4" />
                      <h1 className="text-xl font-semibold text-gray-800">NXTGEN College Guide</h1>
                    </header>
                    
                    {/* Main Content */}
                    <main className="flex-1">
                      <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/predictor" element={<Predictor />} />
                        <Route path="/colleges" element={<Colleges />} />
                        <Route path="/college-details/:id" element={<CollegeDetails />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
