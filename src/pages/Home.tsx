
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
  Star,
  ExternalLink,
  GitCompare
} from "lucide-react";
import { toast } from "sonner";

interface College {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  total_fees_min: number;
  placement_percentage: number;
  image_url?: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image_url?: string;
  external_link?: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popularColleges, setPopularColleges] = useState<College[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
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
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
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

  const fetchPopularColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, type, rating, total_fees_min, placement_percentage, image_url')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPopularColleges(data || []);
    } catch (error) {
      console.error('Error fetching popular colleges:', error);
    }
  };

  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, category, date, image_url, external_link')
        .eq('category', 'news')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      setLatestNews(data || []);
    } catch (error) {
      console.error('Error fetching latest news:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchColleges(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    fetchPopularColleges();
    fetchLatestNews();
  }, []);

  const quickActions = [
    {
      title: "College Finder",
      description: "Browse and compare colleges",
      icon: GraduationCap,
      path: "/colleges",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Rank Predictor",
      description: "Predict your entrance exam rank",
      icon: Target,
      path: "/predictor",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      title: "Latest News",
      description: "Stay updated with announcements",
      icon: Newspaper,
      path: "/news",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Compare Colleges",
      description: "Compare multiple colleges",
      icon: GitCompare,
      path: "/compare",
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
          <div className="text-center space-y-4 lg:space-y-6">
            <div className="space-y-2 lg:space-y-3">
              <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">
                Find Your Perfect College
              </h1>
              <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Discover, compare, and get admitted to the best colleges for your future
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search colleges by name, location, or type..."
                  className="h-12 lg:h-14 text-base lg:text-lg pl-12 pr-4 border-2 border-gray-200 focus:border-green-500 bg-white shadow-sm rounded-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {loading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {showResults && (
                <Card className="max-h-80 overflow-y-auto bg-white shadow-lg border border-gray-200 rounded-lg">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {searchResults.map((college) => (
                        <div
                          key={college.id}
                          className="p-3 lg:p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0"
                          onClick={() => navigate(`/college-details/${college.id}`)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">{college.name}</h3>
                              <div className="flex items-center space-x-4 text-xs lg:text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-500" />
                                  {college.location}
                                </div>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {college.type}
                                </span>
                              </div>
                            </div>
                            <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 lg:p-8 text-center text-gray-500">
                      <Search className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm lg:text-base">No colleges found matching your search.</p>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Colleges Section */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Popular Colleges</h2>
              <p className="text-sm lg:text-base text-gray-600">Top-rated colleges based on student reviews</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/colleges')}
              className="border-green-500 text-green-600 hover:bg-green-50 text-sm lg:text-base"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {popularColleges.map((college) => (
              <Card
                key={college.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white border border-gray-200"
                onClick={() => navigate(`/college-details/${college.id}`)}
              >
                {college.image_url && (
                  <img 
                    src={college.image_url} 
                    alt={college.name}
                    className="w-full h-32 lg:h-40 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-3 lg:p-4">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">{college.name}</h3>
                  <p className="text-gray-600 text-xs lg:text-sm mb-3 flex items-center">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    {college.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold text-gray-900 text-sm lg:text-base">{college.rating}</span>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-green-600">
                      ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Latest News</h2>
            <p className="text-sm lg:text-base text-gray-600">Stay updated with the latest educational news</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/news')}
            className="border-blue-500 text-blue-600 hover:bg-blue-50 text-sm lg:text-base"
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {latestNews.map((news) => (
            <Card
              key={news.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg bg-white border border-gray-200"
              onClick={() => news.external_link ? window.open(news.external_link, '_blank') : null}
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {news.category}
                  </span>
                  {news.external_link && (
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base">{news.title}</h3>
                <p className="text-gray-600 text-xs lg:text-sm mb-3 line-clamp-3">{news.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                  {new Date(news.date).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Quick Actions
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              Everything you need for your educational journey
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-green-300 bg-white p-3 lg:p-6"
                onClick={() => navigate(action.path)}
              >
                <div className="text-center space-y-2 lg:space-y-4">
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <action.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <h3 className="text-sm lg:text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
