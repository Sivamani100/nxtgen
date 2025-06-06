import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Search, Star, MapPin, TrendingUp, Award, Heart, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-base text-gray-600">Find your perfect college</p>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="w-6 h-6" />
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
              className="pl-10 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-green-500"
            onClick={() => navigate('/predictor')}
          >
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-sm font-semibold">Rank Predictor</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-2 hover:border-blue-500"
            onClick={() => navigate('/colleges')}
          >
            <Award className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-semibold">Browse Colleges</span>
          </Button>
        </div>

        {/* Latest News Section */}
        {news.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">Latest Updates</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/news')} className="text-green-600 font-medium">
                View all
              </Button>
            </div>
            <div className="space-y-3">
              {news.slice(0, 2).map((item) => (
                <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
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

        {/* Recommended Colleges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">
              {userProfile?.preferred_locations?.length > 0 || userProfile?.budget_min ? 
                'Recommended For You' : 'Top Colleges'}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/colleges')} className="text-green-600 font-medium">
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {colleges.map((college) => (
              <Card key={college.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/college-details/${college.id}`)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center text-base text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {college.location}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-bold text-gray-900">{college.rating}/5.0</span>
                      </div>
                      <span className="font-bold text-green-600">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{college.type}</span>
                  <span className="text-xs font-bold text-blue-600">{college.placement_percentage}% placement</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* User Preferences Info */}
        {userProfile && (userProfile.preferred_locations?.length > 0 || userProfile.budget_min) && (
          <Card className="p-4 mb-6 bg-green-50 border-green-200">
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
                className="text-green-700 p-0 h-auto mt-2 font-medium"
                onClick={() => navigate('/profile')}
              >
                Update preferences →
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-green-600"
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/profile')}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
