
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Bell, User, Heart, Newspaper, Home as HomeIcon, BookOpen, Calendar, Users } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  rating: number;
  image_url: string;
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  created_at: string;
  category: string;
  source: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_location: string;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [topColleges, setTopColleges] = useState<College[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch top colleges
      const { data: colleges } = await supabase
        .from('colleges')
        .select('id, name, location, rating, image_url')
        .order('rating', { ascending: false })
        .limit(5);

      // Fetch latest news
      const { data: news } = await supabase
        .from('resources')
        .select('id, title, description, created_at, category, source')
        .eq('category', 'News')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('resources')
        .select('id, title, description, event_date, event_location')
        .eq('category', 'Event')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);

      setTopColleges(colleges || []);
      setLatestNews(news || []);
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getDaysLeft = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
            placeholder="Search colleges, courses..."
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

        {/* Top Colleges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Top Colleges in AP</h3>
            <Button variant="link" className="text-green-600 text-sm p-0" onClick={() => navigate('/colleges')}>View All</Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {topColleges.map((college) => (
              <Card key={college.id} className="flex-shrink-0 w-48 p-3 cursor-pointer" onClick={() => navigate(`/college-details/${college.id}`)}>
                <div className="h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-sm text-center px-2">{college.name.substring(0, 20)}</span>
                </div>
                <h4 className="font-medium text-sm">{college.name}</h4>
                <p className="text-xs text-gray-600">{college.location}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-yellow-500 text-xs">★ {college.rating}</span>
                  <Button size="sm" className="text-xs h-6 bg-green-600 hover:bg-green-700">View</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Latest News</h3>
            <Button variant="link" className="text-green-600 text-sm p-0" onClick={() => navigate('/news')}>View All</Button>
          </div>
          <div className="space-y-3">
            {latestNews.map((news) => (
              <Card key={news.id} className="p-3 cursor-pointer" onClick={() => navigate('/news')}>
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-2">{news.category}</div>
                <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{new Date(news.created_at).toLocaleDateString()}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{news.description}</p>
                <Button variant="link" className="text-green-600 text-xs p-0 h-auto">Read More</Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
            <Button variant="link" className="text-green-600 text-sm p-0" onClick={() => navigate('/news')}>View All</Button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</div>
                    <div className="text-xs text-gray-600">{new Date(event.event_date).toLocaleDateString('en-US', { day: '2-digit' })}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.event_location}</p>
                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded inline-block mt-1">
                      {getDaysLeft(event.event_date)} Days left
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-5 h-5" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/profile')}
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
