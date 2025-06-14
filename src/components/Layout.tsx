
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Users, BookOpen, Newspaper, User, Bell, Heart, Search, Menu, X, ChevronLeft, ChevronRight, GitCompare } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/home" },
    { icon: Users, label: "Colleges", path: "/colleges" },
    { icon: BookOpen, label: "Predictor", path: "/predictor" },
    { icon: Newspaper, label: "News", path: "/news" },
    { icon: GitCompare, label: "Compare", path: "/compare" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  // Mobile navigation items (only 5 main ones)
  const mobileNavigationItems = [
    { icon: HomeIcon, label: "Home", path: "/home" },
    { icon: Users, label: "Colleges", path: "/colleges" },
    { icon: BookOpen, label: "Predictor", path: "/predictor" },
    { icon: Newspaper, label: "News", path: "/news" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar - Left side - Only show on lg and above */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!isSidebarCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                NXTGEN
              </h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-green-50"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'} text-left h-12 transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700"
                }`}
                onClick={() => navigate(item.path)}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? '' : 'mr-3'}`} />
                {!isSidebarCollapsed && item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Adjust margin for desktop sidebar */}
      <div className={`lg:transition-all lg:duration-300 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <div className="pb-[70px] lg:pb-0 min-h-screen">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only show on mobile (below lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 h-[70px]">
        <div className="flex justify-around items-center py-2 px-1 h-full">
          {mobileNavigationItems.map((item) => (
            <button
              key={item.path}
              className={`flex flex-col items-center justify-center p-1 min-w-0 flex-1 transition-all duration-200 h-full`}
              onClick={() => navigate(item.path)}
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-green-500 text-white"
                  : "text-gray-600"
              }`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? "text-green-500"
                  : "text-gray-600"
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
