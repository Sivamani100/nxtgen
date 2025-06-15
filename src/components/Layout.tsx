import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Users, BookOpen, Newspaper, User, Bell, Heart, Search, Menu, X, ChevronLeft, ChevronRight, GitCompare, HelpCircle, Shield, Calendar, MessageCircle, Star } from "lucide-react";
import { navItems } from "@/nav-items";

interface LayoutProps {
  children: React.ReactNode;
}

// Type for nav item (imported from nav-items.tsx)
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

  // Ensure correct type for sidebarNavItems so TS knows 'icon' exists
  const sidebarNavItems = navItems.filter(
    (item): item is NavItem & { icon: NonNullable<NavItem["icon"]> } =>
      !!item.icon && (!item.desktopOnly || isDesktop)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-[101px]' : 'lg:w-[294px]'
      }`}>
        <div className="flex flex-col h-full">
          {/* Top blank */}
          <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200">
            <div className="flex items-center justify-center w-full">
              {/* Logo area (left blank as per previous setup) */}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-green-50 ml-auto"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-2">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.to}
                variant={isActive(item.to) ? "default" : "ghost"}
                className={`w-full ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-start'} text-left h-12 transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700"
                }`}
                onClick={() => navigate(item.to)}
                title={isSidebarCollapsed ? item.title : undefined}
              >
                {item.icon && (
                  typeof item.icon === "object"
                    ? item.icon
                    : <item.icon className={`w-5 h-5 ${isSidebarCollapsed ? "" : "mr-3"}`} />
                )}
                {!isSidebarCollapsed && item.title}
              </Button>
            ))}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className={`lg:transition-all lg:duration-300 ${isSidebarCollapsed ? 'lg:pl-[101px]' : 'lg:pl-[294px]'}`}>
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
    </div>
  );
};

export default Layout;
