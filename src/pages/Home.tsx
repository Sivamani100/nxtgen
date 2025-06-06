import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Search, Star, MapPin, TrendingUp, Award, Heart, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";
import { BottomNavigation } from "@/components/BottomNavigation";

interface College {
  id: number;
  name: string;
  location: string;
  rating: number;
  type: string;
  total_fees_min: number;
  total_fees_max: number;
  placement_percentage: number;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  external_link?: string;
}

const Home = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchColleges();
    fetchNews();
    fetchNotificationCount();
  }, []);

  useEffect(() => {
    if (userProfile) {
      fetchFilteredColleges();
    }
  }, [userProfile]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchFilteredColleges = async () => {
    try {
      let query = supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

      if (userProfile?.preferred_locations && userProfile.preferred_locations.length > 0) {
        query = query.in('city', userProfile.preferred_locations);
      }

      if (userProfile?.budget_min && userProfile?.budget_max) {
        query = query
          .gte('total_fees_min', userProfile.budget_min)
          .lte('total_fees_max', userProfile.budget_max);
      }

      const { data, error } = await query;

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching filtered colleges:', error);
      fetchColleges();
    }
  };

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .in('category', ['News', 'Event'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white shadow-lg p-4 border-b-2 border-blue-100">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="text-base text-gray-600">Find your perfect college</p>
              </div>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2 hover:bg-blue-50"
                  onClick={() => navigate('/notifications')}
                >
                  <Bell className="w-6 h-6 text-blue-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, courses, news..."
                className="pl-10 text-base border-2 border-blue-200 focus:border-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto p-4 pb-24">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              variant="outline"
              className="h-24 flex-col space-y-3 border-3 border-green-200 hover:border-green-400 hover:bg-green-50 bg-white shadow-lg"
              onClick={() => navigate('/predictor')}
            >
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-base font-bold text-green-700">Rank Predictor</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col space-y-3 border-3 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-white shadow-lg"
              onClick={() => navigate('/colleges')}
            >
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-base font-bold text-blue-700">Browse Colleges</span>
            </Button>
          </div>

          {/* Recommended Colleges */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {userProfile?.preferred_locations?.length > 0 || userProfile?.budget_min ? 
                  'Recommended For You' : 'Top Colleges'}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="text-green-600 font-medium hover:bg-green-50">
                View all
              </Button>
            </div>
            <div className="space-y-4">
              {colleges.map((college) => (
                <Card key={college.id} className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 bg-white"
                      onClick={() => navigate(`/college-details/${college.id}`)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h3>
                      <div className="flex items-center text-base text-gray-600 mb-1">
                        <MapPin className="w-4 h-4 mr-1 text-red-500" />
                        {college.location}
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-bold text-gray-900">{college.rating}/5.0</span>
                        </div>
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1 hover:bg-red-50">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">{college.type}</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{college.placement_percentage}% placement</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Latest News Section */}
          {news.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Latest Updates</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('/news')} className="text-purple-600 font-medium hover:bg-purple-50">
                  View all
                </Button>
              </div>
              <div className="space-y-4">
                {news.slice(0, 2).map((item) => (
                  <Card key={item.id} className="p-4 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-white">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full font-medium border border-purple-200">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* User Preferences Info */}
          {userProfile && (userProfile.preferred_locations?.length > 0 || userProfile.budget_min) && (
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
              <h3 className="text-lg font-bold text-green-900 mb-2">Your Preferences</h3>
              <div className="space-y-1 text-sm text-green-800">
                {userProfile.preferred_locations?.length > 0 && (
                  <p className="font-medium">📍 Locations: {userProfile.preferred_locations.join(', ')}</p>
                )}
                {userProfile.budget_min && userProfile.budget_max && (
                  <p className="font-medium">💰 Budget: ₹{(userProfile.budget_min / 100000).toFixed(1)}L - ₹{(userProfile.budget_max / 100000).toFixed(1)}L</p>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-700 p-0 h-auto mt-2 font-medium hover:bg-green-100"
                  onClick={() => navigate('/profile')}
                >
                  Update preferences →
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
};

export default Home;
