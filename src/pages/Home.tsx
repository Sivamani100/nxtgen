
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Users, 
  Newspaper,
  GraduationCap,
  Target,
  Award,
  Clock,
  MapPin,
  Phone
} from "lucide-react";
import { toast } from "sonner";

interface College {
  id: number;
  name: string;
  location: string;
  type: string;
  phone?: string;
  website?: string;
  established_year?: number;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchColleges = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      
      setSearchResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchColleges(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const quickActions = [
    {
      title: "College Finder",
      description: "Browse and compare colleges",
      icon: GraduationCap,
      path: "/colleges",
      gradient: "from-blue-400 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Rank Predictor",
      description: "Predict your entrance exam rank",
      icon: Target,
      path: "/predictor",
      gradient: "from-green-400 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      title: "Latest News",
      description: "Stay updated with announcements",
      icon: Newspaper,
      path: "/news",
      gradient: "from-purple-400 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Favorites",
      description: "Your saved colleges and news",
      icon: Award,
      path: "/favorites",
      gradient: "from-pink-400 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100"
    }
  ];

  const stats = [
    { label: "Colleges", value: "500+", icon: GraduationCap },
    { label: "Students Helped", value: "10K+", icon: Users },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Updates Daily", value: "50+", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 border-b border-green-200">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent">
                Welcome to NXTGEN
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Your ultimate platform for college admissions, rank prediction, and educational guidance. 
                Find your perfect college match today!
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges by name, location, or type..."
                  className="h-14 text-lg pl-12 pr-4 border-2 border-green-200 focus:border-green-400 bg-white/90 backdrop-blur-sm shadow-lg rounded-xl"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500" />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {showResults && (
                <Card className="max-h-80 overflow-y-auto bg-white/95 backdrop-blur-sm shadow-xl border-2 border-green-200 rounded-xl">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((college) => (
                        <div
                          key={college.id}
                          className="p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-lg cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0"
                          onClick={() => navigate(`/college-details/${college.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">{college.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1 text-green-500" />
                                  {college.location}
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {college.type}
                                </span>
                                {college.established_year && (
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                    Est. {college.established_year}
                                  </div>
                                )}
                              </div>
                            </div>
                            <GraduationCap className="w-6 h-6 text-blue-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No colleges found matching your search.</p>
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              {stats.map((stat, index) => (
                <Card key={index} className="p-4 lg:p-6 bg-white/80 backdrop-blur-sm border-2 border-white/50 hover:border-green-200 transition-all duration-300 hover:shadow-lg">
                  <div className="text-center space-y-2">
                    <stat.icon className="w-8 h-8 mx-auto text-green-600" />
                    <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            Quick Actions
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need for your educational journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-white/50 hover:border-green-200 bg-gradient-to-br ${action.bgGradient} p-6`}
              onClick={() => navigate(action.path)}
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 border-t border-green-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Choose NXTGEN?
            </h2>
            <p className="text-gray-600 text-lg">
              Comprehensive tools and resources for your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Comprehensive Database</h3>
              <p className="text-gray-600 leading-relaxed">
                Access detailed information about 500+ colleges with real-time updates and accurate data.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Smart Predictions</h3>
              <p className="text-gray-600 leading-relaxed">
                Get accurate rank predictions and college recommendations based on your performance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Real-time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay informed with the latest admission notifications, results, and important announcements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
