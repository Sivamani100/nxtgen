import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  MapPin,
  Star,
  GraduationCap,
  Search,
  Filter,
  BookOpen,
  Clock,
  TrendingUp,
  ArrowRight,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import SaveNewsButton from "@/components/SaveNewsButton";

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
  created_at: string;
}

const Home = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchPopularColleges(),
      fetchLatestNews(),
      fetchUnreadNotificationCount()
    ]).finally(() => {
      setLoading(false);
    });
    // Re-fetch unread count when returning to page
    // Optionally, listen to visibilitychange, omitted for brevity
  }, []);

  const fetchPopularColleges = async () => {
    try {
      console.log('Fetching popular colleges...');
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, type, rating, total_fees_min, placement_percentage, image_url')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      console.log('Popular colleges fetched:', data?.length || 0);
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchLatestNews = async () => {
    try {
      // Always pull from resources where category === 'news'
      let { data, error } = await supabase
        .from('resources')
        .select('id, title, description, category, date, image_url, external_link, created_at')
        .eq('category', 'news')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]); // fallback to empty, don't crash
    }
  };

  const fetchUnreadNotificationCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUnreadNotificationCount(0);
      return;
    }
    const { data, error } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", user.id)
      .eq("read", false);
    setUnreadNotificationCount(data?.length || 0);
  };

  const createSampleNews = async () => {
    const sampleNews = [
      {
        title: 'JEE Main 2024 Registration Opens',
        description: 'National Testing Agency (NTA) has opened the registration for JEE Main 2024. Students can apply online through the official website.',
        category: 'news',
        date: '2024-01-15',
        external_link: 'https://jeemain.nta.nic.in'
      },
      {
        title: 'NEET 2024 Exam Date Announced',
        description: 'The National Eligibility cum Entrance Test (NEET) 2024 will be conducted on May 5, 2024. Registration starts from February 9, 2024.',
        category: 'news',
        date: '2024-01-10',
        external_link: 'https://neet.nta.nic.in'
      }
    ];

    try {
      for (const newsItem of sampleNews) {
        await supabase.from('resources').insert([newsItem]);
      }
    } catch (error) {
      console.error('Error creating sample news:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exam': return 'bg-blue-100 text-blue-800';
      case 'admission': return 'bg-green-100 text-green-800';
      case 'scholarship': return 'bg-purple-100 text-purple-800';
      case 'result': return 'bg-orange-100 text-orange-800';
      case 'notification': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleNotifications = () => {
    navigate('/notifications');
  };

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* Welcome Header with Search */}
      <section className="bg-white border-b border-gray-100 py-4 lg:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-sm lg:text-base text-gray-600">Find your perfect college</p>
            </div>
            <button 
              onClick={handleNotifications}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search colleges, courses, news..."
              className="pl-10 h-12 text-base border-gray-200 focus:border-green-500 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Hero Section - Hidden on mobile, visible on desktop */}
      <section className="hidden lg:block bg-gradient-to-br from-green-50 to-blue-50 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Your Future Starts Here
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 mb-8">
                Explore colleges, courses, and career opportunities.
              </p>
              <div className="space-x-3">
                <Button size="lg" onClick={() => navigate('/colleges')}>
                  Explore Colleges
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/predictor')}>
                  Predict Your Rank
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Colleges Section */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Popular Colleges</h2>
              <p className="text-sm lg:text-base text-gray-600">Discover top-rated institutions</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/colleges')}
              className="text-sm lg:text-base hover:bg-green-50 hover:border-green-300"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {colleges.map((college) => (
                <Card 
                  key={college.id} 
                  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/college-details/${college.id}`)}
                >
                  {college.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={college.image_url} 
                        alt={college.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-4 lg:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 text-xs font-medium">
                        {college.type}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold text-gray-900 text-xs lg:text-sm">{college.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {college.name}
                    </h3>
                    
                    <div className="flex items-center text-xs lg:text-sm text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-500" />
                      {college.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-sm font-medium text-green-600">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                      </span>
                      {college.placement_percentage && (
                        <span className="text-xs lg:text-sm font-medium text-blue-600">
                          {college.placement_percentage}% Placed
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Latest News</h2>
              <p className="text-sm lg:text-base text-gray-600">Stay updated with announcements</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/news')}
              className="text-sm lg:text-base hover:bg-blue-50 hover:border-blue-300"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {news.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                  onClick={() => item.external_link && window.open(item.external_link, '_blank')}
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`text-xs font-medium ${getCategoryColor(item.category)}`}>
                        News
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(item.date || item.created_at)}
                      </div>
                    </div>

                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    {item.external_link && (
                      <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                        <span>Read More</span>
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <SaveNewsButton newsId={item.id} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/colleges')}>
              <div className="text-center">
                <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Explore Colleges
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Find the right college for you
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/predictor')}>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Predict Your Rank
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Know your potential rank
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/search')}>
              <div className="text-center">
                <Search className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Search Colleges
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Find colleges by name or location
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/news')}>
              <div className="text-center">
                <Newspaper className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Latest News
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Stay updated with the latest news
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
