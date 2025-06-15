
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Use lucide-react arrow icon
import { navItems } from "@/nav-items";

interface LayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  title: string;
  to: string;
  icon?: React.ElementType;
  desktopOnly?: boolean;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Filter out 'Profile Page', 'College Predictor', and duplicates
  const sidebarNavItems = navItems
    .filter(
      (item) =>
        item.icon &&
        item.title !== "Profile Page" &&
        item.title !== "College Predictor"
    )
    .filter((item, idx, arr) =>
      !(item.title === "Profile" && arr.findIndex(i => i.title === "Profile") !== idx)
    ) as NavItem[];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside
        className={`relative transition-all duration-200 bg-white border-r border-gray-200 shadow-lg flex flex-col py-6 px-0 ${
          collapsed ? "w-16" : "w-[260px]"
        } min-h-screen`}
      >
        {/* Collapse/Expand button */}
        <div className="flex items-center h-8 mb-6 pl-2">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded transition-all duration-200 ${
              collapsed ? "rotate-180 ml-1" : "ml-0"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((c) => !c)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex flex-col flex-1 gap-1">
          {sidebarNavItems.map((item) => {
            const IconEl = item.icon as React.ElementType;
            return (
              <Button
                key={item.to}
                variant="ghost"
                className={`
                  flex items-center w-full h-12 pl-4 pr-2 rounded-none justify-start
                  transition-colors duration-150
                  ${isActive(item.to)
                    ? "font-medium text-green-700 bg-green-50"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
                onClick={() => navigate(item.to)}
                tabIndex={0}
                aria-label={item.title}
              >
                <span className="flex items-center gap-3">
                  {IconEl && <IconEl className="w-5 h-5" />}
                  {/* Show text only when expanded */}
                  {!collapsed && <span>{item.title}</span>}
                </span>
              </Button>
            );
          })}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-white">
        {children}
      </main>
    </div>
  );
};

export default Layout;

