
import { useLocation, Link } from "react-router-dom";
import { Home, Users, Calculator, Newspaper, User } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname === path;
  };

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/colleges', icon: Users, label: 'Colleges' },
    { path: '/predictor', icon: Calculator, label: 'Predictor' },
    { path: '/news', icon: Newspaper, label: 'News' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? 'text-white' : ''}`} />
                <span className={`text-xs font-medium ${active ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
