
import { Home, Search, Bell, Heart, Newspaper, User, GraduationCap, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Colleges", url: "/colleges", icon: GraduationCap },
  { title: "Predictor", url: "/predictor", icon: TrendingUp },
  { title: "Profile", url: "/profile", icon: User },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-teal-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon 
                className={`w-6 h-6 ${isActive ? "text-teal-500" : "text-gray-500"}`} 
              />
              <span className={`text-xs mt-1 ${isActive ? "text-teal-500 font-medium" : "text-gray-500"}`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
