
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navItems } from "@/nav-items";

interface LayoutProps {
  children: React.ReactNode;
}

type NavItem = {
  title: string;
  to: string;
  icon?: React.ReactElement | ((props: any) => JSX.Element);
  desktopOnly?: boolean;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Only include each item once, filter out 'Profile Page', 'College Predictor', and any dupes.
  // Also make sure to not include the collapsed/centered logic, everything left-aligned
  const sidebarNavItems = navItems
    .filter(
      (item) =>
        item.icon &&
        item.title !== "Profile Page" &&
        item.title !== "College Predictor"
    )
    .filter((item, idx, arr) =>
      // Only allow one "Profile"
      !(item.title === "Profile" && arr.findIndex(i => i.title === "Profile") !== idx)
    ) as NavItem[];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Fixed Sidebar */}
      <aside className="w-[260px] min-h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col py-6 px-0">
        {/* Logo space, left blank */}
        <div className="h-8 mb-6 pl-8">
          {/* Logo could go here */}
        </div>
        {/* Navigation */}
        <nav className="flex flex-col flex-1 gap-2">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.to}
              variant="ghost"
              className={`
                flex items-center w-full h-12 pl-8 pr-2 rounded-none justify-start
                transition-colors duration-150
                ${isActive(item.to)
                  ? "font-medium text-green-700 bg-green-50"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                }
                `}
              onClick={() => navigate(item.to)}
            >
              <span className="flex items-center gap-3">
                {item.icon &&
                  (typeof item.icon === "object"
                    ? item.icon
                    : <item.icon className="w-5 h-5" />)}
                <span>{item.title}</span>
              </span>
            </Button>
          ))}
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
