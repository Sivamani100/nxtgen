
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Bell, User, Heart, Newspaper, Home as HomeIcon, BookOpen, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface Resource {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  details: any;
  created_at: string;
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
  created_at: string;
  category: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
    
    // Set up real-time subscriptions
    const resourcesSubscription = supabase
      .channel('resources_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'resources'
      }, (payload) => {
        console.log('New resource:', payload.new);
        fetchRecommendations();
      })
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('New notification:', payload.new);
        fetchNotifications();
      })
      .subscribe();

    return () => {
      resourcesSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    await Promise.all([fetchRecommendations(), fetchNotifications()]);
    setLoading(false);
  };

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recommendations:', error);
        return;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate('/');
    }
  };

  const quickLinks = [
    { name: "Scholarships", icon: BookOpen, category: "Scholarship", color: "bg-blue-500" },
    { name: "Admissions", icon: Users, category: "Admission", color: "bg-green-500" },
    { name: "Events", icon: Calendar, category: "Event", color: "bg-purple-500" },
    { name: "News", icon: Newspaper, category: "News", color: "bg-orange-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="text-xl font-bold text-green-600">NXTGEN</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="p-2"
          >
            <User className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Quick Actions */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-green-200"
              onClick={() => navigate('/predictor')}
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs">Predict Your Rank</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-blue-200"
              onClick={() => navigate('/colleges')}
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs">Find Colleges</span>
            </Button>
          </div>
        </Card>

        {/* Featured Content */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Why Choose Us?</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
          </div>
          <div className="space-y-3">
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Accurate Rank Prediction</h4>
                  <p className="text-sm text-gray-600">Our AI-powered algorithm provides highly accurate rank predictions based on historical data and current trends</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Comprehensive College Database</h4>
                  <p className="text-sm text-gray-600">Access detailed information about thousands of colleges, including courses, fees, placements, and more</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Real-Time News Updates</h4>
                  <p className="text-sm text-gray-600">Get instant notifications about exam dates, results, and important announcements from colleges</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Top Colleges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Top Colleges in AP</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            <Card className="flex-shrink-0 w-48 p-3">
              <div className="h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded mb-2 flex items-center justify-center">
                <span className="text-white font-bold">IIT</span>
              </div>
              <h4 className="font-medium text-sm">Andhra University</h4>
              <p className="text-xs text-gray-600">Visakhapatnam</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 text-xs">★ 4.5</span>
                <Button size="sm" className="ml-auto text-xs h-6 bg-green-600 hover:bg-green-700">View</Button>
              </div>
            </Card>
            <Card className="flex-shrink-0 w-48 p-3">
              <div className="h-24 bg-gradient-to-br from-green-400 to-green-600 rounded mb-2 flex items-center justify-center">
                <span className="text-white font-bold">IIT</span>
              </div>
              <h4 className="font-medium text-sm">Andhra University</h4>
              <p className="text-xs text-gray-600">Visakhapatnam</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 text-xs">★ 4.5</span>
                <Button size="sm" className="ml-auto text-xs h-6 bg-green-600 hover:bg-green-700">View</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Latest News */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Latest News</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
          </div>
          <div className="space-y-3">
            <Card className="p-3">
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-2">Admissions</div>
              <h4 className="font-medium text-sm mb-1">EAMCET 2025 Counseling schedule</h4>
              <p className="text-xs text-gray-600 mb-1">May 24, 2025</p>
              <p className="text-xs text-gray-600">The counseling for EAMCET 2025 admission will begin from June 19, 2025</p>
              <Button variant="link" className="text-green-600 text-xs p-0 h-auto">Read More</Button>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block mb-2">Scholarships</div>
              <h4 className="font-medium text-sm mb-1">New Government Scholarship for Engineering Students</h4>
              <p className="text-xs text-gray-600 mb-1">May 22, 2025</p>
              <p className="text-xs text-gray-600">Applications open for merit-based scholarships worth $5000 per semester</p>
              <Button variant="link" className="text-green-600 text-xs p-0 h-auto">Read More</Button>
            </Card>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
            <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
          </div>
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">June</div>
                  <div className="text-xs text-gray-600">5-6, 2025</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">JEE Advanced 2025</h4>
                  <p className="text-xs text-gray-600">All India Engineering Entrance</p>
                  <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded inline-block mt-1">10 Days left</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">May</div>
                  <div className="text-xs text-gray-600">27, 2025</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">NEET UG 2025</h4>
                  <p className="text-xs text-gray-600">Medical Entrance Exam</p>
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block mt-1">22 Days left</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => setActiveTab('home')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'colleges' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => {
                setActiveTab('colleges');
                navigate('/colleges');
              }}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'predictor' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => {
                setActiveTab('predictor');
                navigate('/predictor');
              }}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'news' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => {
                setActiveTab('news');
                navigate('/news');
              }}
            >
              <Newspaper className="w-5 h-5" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center space-y-1 p-2 ${activeTab === 'profile' ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => {
                setActiveTab('profile');
                navigate('/profile');
              }}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
