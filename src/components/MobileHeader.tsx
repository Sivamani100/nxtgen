
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Users, BookOpen, Newspaper, User, GitCompare, Heart, Search, Bell, HelpCircle, Shield, Star, Calendar, MessageCircle } from "lucide-react";

const MobileHeader = () => {
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
      default:
        return (
          <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-bold">
            NXTGEN
          </span>
        );
    }
  };

  return (
    <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <h1 className="text-lg">
        {getPageTitle()}
      </h1>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="p-6">
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
    </div>
  );
};

export default MobileHeader;
