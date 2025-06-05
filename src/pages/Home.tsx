
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, GraduationCap, Newspaper, Search, User, Bell, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchRecentNews();
  }, []);

  const fetchUserData = async () => {
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
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const quickActions = [
    {
      icon: BookOpen,
      title: "Colleges",
      description: "Explore colleges",
      action: () => navigate('/colleges'),
      color: "bg-blue-500"
    },
    {
      icon: Target,
      title: "Predictor",
      description: "Predict admission",
      action: () => navigate('/predictor'),
      color: "bg-green-500"
    },
    {
      icon: Newspaper,
      title: "News",
      description: "Latest updates",
      action: () => navigate('/news'),
      color: "bg-purple-500"
    },
    {
      icon: Search,
      title: "Search",
      description: "Find courses",
      action: () => navigate('/search'),
      color: "bg-orange-500"
    }
  ];

  const bottomNavItems = [
    {
      icon: BookOpen,
      label: "Colleges",
      action: () => navigate('/colleges'),
      active: false
    },
    {
      icon: Target,
      label: "Predictor", 
      action: () => navigate('/predictor'),
      active: false
    },
    {
      icon: GraduationCap,
      label: "Home",
      action: () => navigate('/home'),
      active: true
    },
    {
      icon: Newspaper,
      label: "News",
      action: () => navigate('/news'),
      active: false
    },
    {
      icon: User,
      label: "Profile",
      action: () => navigate('/profile-page'),
      active: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ fontSize: '20px' }}>
              Welcome back, {profile?.full_name || 'Student'}!
            </h1>
            <p className="text-white/80" style={{ fontSize: '15px' }}>
              Ready to explore your educational journey?
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="text-white hover:bg-white/20"
          >
            <Bell className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full ${action.color} text-white mb-3`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>{action.title}</h3>
                  <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>{action.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Your Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" style={{ fontSize: '20px' }}>150+</div>
              <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>Colleges Available</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600" style={{ fontSize: '20px' }}>85%</div>
              <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>Success Rate</p>
            </div>
          </div>
        </Card>

        {/* Recent News */}
        {recentNews.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900" style={{ fontSize: '20px' }}>Latest News</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/news')}
                className="text-green-600"
              >
                <span style={{ fontSize: '15px' }}>View All</span>
              </Button>
            </div>
            <div className="space-y-3">
              {recentNews.slice(0, 2).map((article) => (
                <Card key={article.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    {article.image_url && (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 line-clamp-2" style={{ fontSize: '15px' }}>
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2" style={{ fontSize: '15px' }}>
                        {article.summary}
                      </p>
                      <span className="text-xs text-green-600 font-medium" style={{ fontSize: '15px' }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900" style={{ fontSize: '15px' }}>Trending Now</h3>
              <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>Engineering admissions are open!</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.action}
              className={`flex flex-col items-center py-2 px-3 ${
                item.active 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <item.icon className="w-7 h-7 mb-1" />
              <span className="text-xs" style={{ fontSize: '15px' }}>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
