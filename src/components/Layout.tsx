
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Users, BookOpen, Newspaper, User, Bell, Heart, Search, ChevronLeft, ChevronRight, GitCompare, HelpCircle, Shield, Calendar, MessageCircle, Star } from "lucide-react";
import { navItems } from "@/nav-items";
import MobileHeader from "./MobileHeader";

interface LayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  title: string;
  to: string;
  icon?: React.ReactElement | ((props: any) => JSX.Element);
  page?: React.ReactNode;
  desktopOnly?: boolean;
};

const mobileNavigationItems = [
  { icon: HomeIcon, label: "Home", path: "/home" },
  { icon: Users, label: "Colleges", path: "/colleges" },
  { icon: BookOpen, label: "Predictor", path: "/predictor" },
  { icon: Newspaper, label: "News", path: "/news" },
  { icon: User, label: "Profile", path: "/profile" }
];

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024; // lg breakpoint

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter sidebar items - exclude duplicates and profile page
  const sidebarNavItems = navItems
    .filter(
      (item) =>
        item.icon &&
        (!item.desktopOnly || isDesktop) &&
        item.title !== "Profile Page" &&
        item.title !== "College Predictor" // Exclude College Predictor from sidebar
    )
    .filter((item, idx, arr) =>
      // For "Profile", only include the first one encountered:
      !(item.title === "Profile" && arr.findIndex(i => i.title === "Profile") !== idx)
    ) as NavItem[];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              {!isSidebarCollapsed && (
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation - Remove scrollbar */}
          <nav className="flex-1 py-4 overflow-hidden">
            <div className="space-y-1 h-full overflow-y-auto scrollbar-hide">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.to}
                  variant={isActive(item.to) ? "default" : "ghost"}
                  className={`
                    ${isSidebarCollapsed
                      ? "w-12 h-12 mx-2 p-0 flex items-center justify-center"
                      : "w-full mx-2 px-3 py-2 justify-start text-left"
                    }
                    transition-all duration-200
                    ${isActive(item.to)
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    rounded-lg
                  `}
                  onClick={() => navigate(item.to)}
                  title={isSidebarCollapsed ? item.title : undefined}
                >
                  <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} w-full`}>
                    <span className="flex-shrink-0">
                      {item.icon &&
                        (typeof item.icon === "object"
                          ? item.icon
                          : React.createElement(item.icon, { className: "w-5 h-5" }))}
                    </span>
                    {!isSidebarCollapsed && (
                      <span className="ml-3 text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`lg:transition-all lg:duration-300 ${isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <div className="pb-[70px] lg:pb-0 min-h-screen">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
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

      {/* Custom CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Layout;
