
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home as HomeIcon, Users, BookOpen, Newspaper, User, Bell, Heart, Search, ChevronLeft, ChevronRight, GitCompare, HelpCircle, Shield, Calendar, MessageCircle, Star } from "lucide-react";
import { navItems } from "@/nav-items";

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

  // Only ONE predictor in sidebar.
  // Exclude "College Predictor" from the sidebar.
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
      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:overflow-y-auto lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-lg transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:w-[101px]' : 'lg:w-[294px]'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-2 border-b border-gray-200">
            <div className="flex items-center justify-center w-full">
              {/* Logo area left blank */}
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
          <nav className="flex-1 py-8 space-y-0 flex flex-col gap-0 items-center justify-start">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.to}
                variant={isActive(item.to) ? "default" : "ghost"}
                className={`
                  ${isSidebarCollapsed
                    ? "justify-center !px-0 flex flex-col w-14 h-14 mb-4"
                    : "justify-start w-[88%] mx-auto flex flex-row items-center h-12 mb-4 px-2"}
                  transition-all duration-200
                  ${isActive(item.to)
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-md"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700"
                  }
                  relative
                  group
                  rounded-lg
                `}
                onClick={() => navigate(item.to)}
                title={isSidebarCollapsed ? item.title : undefined}
                style={{
                  minWidth: isSidebarCollapsed ? 56 : undefined,
                  minHeight: isSidebarCollapsed ? 56 : undefined,
                }}
              >
                <span className="flex items-center justify-center w-full">
                  {item.icon &&
                    (typeof item.icon === "object"
                      ? item.icon
                      : <item.icon className={`w-6 h-6 ${isSidebarCollapsed ? "" : "mr-3"}`} />)}
                  {!isSidebarCollapsed && <span className="ml-0">{item.title}</span>}
                </span>
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
