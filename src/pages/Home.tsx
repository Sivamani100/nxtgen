
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Star, MapPin, TrendingUp, Users, BookOpen, Award, Bell } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchColleges();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const searchColleges = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`)
        .order('rating', { ascending: false })
        .limit(8);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Users,
      title: "Browse Colleges",
      description: "Explore thousands of colleges",
      path: "/colleges",
      color: "bg-blue-500"
    },
    {
      icon: BookOpen,
      title: "College Predictor",
      description: "Find colleges based on your rank",
      path: "/predictor",
      color: "bg-green-500"
    },
    {
      icon: TrendingUp,
      title: "Latest News",
      description: "Stay updated with education news",
      path: "/news",
      color: "bg-purple-500"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Check your latest updates",
      path: "/notifications",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Welcome to NXTGEN
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your ultimate platform for college admissions, predictions, and educational guidance
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for colleges, courses, or locations..."
              className="h-14 pl-14 pr-4 text-base bg-white/90 backdrop-blur border-0 rounded-xl shadow-lg focus:bg-white focus:shadow-xl transition-all"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map((college) => (
                <Card 
                  key={college.id} 
                  className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-blue-300"
                  onClick={() => navigate(`/college-details/${college.id}`)}
                >
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{college.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      <span className="truncate">{college.location}, {college.state}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="font-bold text-xs">{college.rating}/5.0</span>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-gray-300 group"
                onClick={() => navigate(action.path)}
              >
                <div className="p-6">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">5000+</h3>
              <p className="text-blue-100">Colleges Listed</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">95%</h3>
              <p className="text-green-100">Prediction Accuracy</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-1">50K+</h3>
              <p className="text-purple-100">Students Helped</p>
            </div>
          </Card>
        </div>

        {/* Welcome Message */}
        {user && (
          <Card className="bg-white border-l-4 border-blue-500">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Welcome back, {user.email}!
              </h3>
              <p className="text-gray-600">
                Ready to explore colleges and plan your future? Use our tools to find the perfect college for you.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
