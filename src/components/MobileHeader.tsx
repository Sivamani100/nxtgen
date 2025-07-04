
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Users, BookOpen, Newspaper, User, GitCompare, Heart, Search, Bell, HelpCircle, Shield, Star, Calendar, MessageCircle, Edit, Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MobileHeaderProps {
  onEditToggle?: () => void;
}

const MobileHeader = ({ onEditToggle }: MobileHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Users, label: "Colleges", path: "/colleges" },
    { icon: BookOpen, label: "Predictor", path: "/predictor" },
    { icon: BookOpen, label: "College Predictor", path: "/college-predictor" },
    { icon: Newspaper, label: "News", path: "/news" },
    { icon: GitCompare, label: "Compare", path: "/compare" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Star, label: "My Colleges", path: "/my-colleges" },
    { icon: Star, label: "College Reviews", path: "/college-reviews" },
    { icon: Star, label: "College Quiz", path: "/college-recommendation-quiz" },
    { icon: HelpCircle, label: "Scholarships", path: "/scholarships" },
    { icon: Calendar, label: "Application Tracker", path: "/application-tracker" },
    { icon: MessageCircle, label: "Forum", path: "/forum" },
    { icon: Shield, label: "Privacy Policy", path: "/privacy-policy" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: HelpCircle, label: "Help", path: "/help" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/home':
        return (
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-bold">
            NXTGEN
          </span>
        );
      case '/colleges':
        return <span className="text-blue-600 font-bold">Colleges</span>;
      case '/predictor':
        return <span className="text-green-600 font-bold">Predictor</span>;
      case '/news':
        return <span className="text-orange-600 font-bold">News</span>;
      case '/profile':
        return <span className="text-purple-600 font-bold">Profile</span>;
      case '/search':
        return <span className="text-purple-600 font-bold">Search</span>;
      case '/compare':
        return <span className="text-indigo-600 font-bold">Compare</span>;
      case '/favorites':
        return <span className="text-pink-600 font-bold">Favorites</span>;
      case '/my-colleges':
        return <span className="text-blue-600 font-bold">My Colleges</span>;
      case '/college-reviews':
        return <span className="text-yellow-600 font-bold">Reviews</span>;
      case '/notifications':
        return <span className="text-red-600 font-bold">Notifications</span>;
      case '/scholarships':
        return <span className="text-purple-600 font-bold">Scholarships</span>;
      case '/application-tracker':
        return <span className="text-green-600 font-bold">Applications</span>;
      case '/forum':
        return <span className="text-blue-600 font-bold">Forum</span>;
      case '/team':
        return <span className="text-indigo-600 font-bold">Team</span>;
      case '/help':
        return <span className="text-gray-600 font-bold">Help</span>;
      case '/privacy-policy':
        return <span className="text-gray-600 font-bold">Privacy</span>;
      default:
        return (
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-bold">
            NXTGEN
          </span>
        );
    }
  };

  const handleSavedNewsClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For now, navigate to a saved news page (we can create this route later)
        // or show saved news in a modal/separate component
        navigate('/saved-news'); // This route needs to be created or handled
        return;
      }
      // Navigate to saved news specifically, not college favorites
      navigate('/saved-news'); // This should be a dedicated saved news page
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const getRightIcon = () => {
    switch (location.pathname) {
      case '/colleges':
        return (
          <button 
            onClick={() => navigate('/favorites')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bookmark className="w-6 h-6 text-gray-600" />
          </button>
        );
      case '/news':
        return (
          <button 
            onClick={handleSavedNewsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bookmark className="w-6 h-6 text-gray-600" />
          </button>
        );
      case '/profile':
        return (
          <button 
            onClick={onEditToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-6 h-6 text-gray-600" />
          </button>
        );
      default:
        return (
          <button 
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
        );
    }
  };

  return (
    <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      {/* Left side - Menu button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              NXTGEN Menu
            </h2>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Center - Page title (left aligned) */}
      <div className="flex-1 flex justify-start ml-4">
        <h1 className="text-lg font-semibold">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right side - Context specific icon */}
      {getRightIcon()}
    </div>
  );
};

export default MobileHeader;
