
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  ChevronRight,
  BookOpen,
  Target,
  Award
} from "lucide-react";
import { toast } from "sonner";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { useCollegeFilters } from "@/hooks/useCollegeFilters";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];
type Resource = Database['public']['Tables']['resources']['Row'];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [news, setNews] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { filters, setFilters, filteredColleges } = useCollegeFilters(colleges);

  useEffect(() => {
    fetchPopularColleges();
    fetchLatestNews();
  }, []);

  const fetchPopularColleges = async () => {
    try {
      console.log('Fetching popular colleges...');
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, city, state, type, rating, total_fees_min, placement_percentage, image_url')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      console.log('Popular colleges fetched:', data?.length || 0);
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    }
  };

  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'news')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      console.log('Latest news fetched:', data?.length || 0);
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const stats = [
    { icon: GraduationCap, label: "Colleges", value: "5000+", color: "text-blue-600" },
    { icon: Users, label: "Students Helped", value: "50k+", color: "text-green-600" },
    { icon: Award, label: "Success Rate", value: "95%", color: "text-purple-600" },
    { icon: Target, label: "Predictions", value: "98% Accurate", color: "text-orange-600" }
  ];

  const quickActions = [
    { icon: Search, label: "College Predictor", path: "/predictor", color: "bg-blue-500" },
    { icon: Target, label: "Rank Predictor", path: "/predictor", color: "bg-green-500" },
    { icon: BookOpen, label: "Browse Colleges", path: "/colleges", color: "bg-purple-500" },
    { icon: Award, label: "Scholarships", path: "/scholarship-finder", color: "bg-orange-500" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 lg:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
          <div className="text-center space-y-6">
            <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
              Find Your Perfect College
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the best colleges, predict admissions, and make informed decisions for your future
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search colleges by name, location, or field..."
                  className="pl-10 pr-12 h-12 text-base border-0 focus:border-0 focus:ring-2 focus:ring-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100"
                />
                <Button
                  onClick={() => setShowFilterModal(true)}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 text-blue-100 hover:text-white hover:bg-white/10"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full mt-4 h-12 bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                size="lg"
              >
                Search Colleges
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 text-center">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 overflow-hidden group"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{action.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Colleges Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Popular Colleges</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/colleges')}
            className="hidden lg:flex items-center space-x-2"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {colleges.slice(0, 6).map((college) => (
            <Card 
              key={college.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
              onClick={() => navigate(`/college-details/${college.id}`)}
            >
              {college.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={college.image_url} 
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {college.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm">{college.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{college.rating}/5.0</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{college.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => navigate('/colleges')}
          className="w-full lg:hidden mt-4"
          variant="outline"
        >
          View All Colleges
        </Button>
      </div>

      {/* Latest News Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Latest News</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/news')}
            className="hidden lg:flex items-center space-x-2"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {news.map((item) => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0"
              onClick={() => window.open(item.external_link || '#', '_blank')}
            >
              {item.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <Badge className="mb-2 bg-green-100 text-green-800">News</Badge>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {item.date && new Date(item.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          onClick={() => navigate('/news')}
          className="w-full lg:hidden mt-4"
          variant="outline"
        >
          View All News
        </Button>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onOpenChange={setShowFilterModal}
        onFiltersApply={setFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Home;
