
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Home as HomeIcon, Users, BookOpen, Newspaper } from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  created_at: string;
  category: string;
  source: string;
  image_url?: string;
  event_date?: string;
  event_location?: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'News')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'Event')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const getDaysLeft = (eventDate: string) => {
    const today = new Date();
    const event = new Date(eventDate);
    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Education News</h1>
            <p className="text-sm text-gray-600">Stay updated with latest news</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto flex">
          <Button
            variant="ghost"
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'news' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('news')}
          >
            Latest News
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'events' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Upcoming Events
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'news' && (
              <>
                {articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-blue-400 to-green-500 relative">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <Newspaper className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm font-medium">Educational News</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-2">
                        {article.category}
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <User className="w-4 h-4 mr-1" />
                        <span>{article.source || 'NXTGEN'}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => navigate(`/news-details/${article.id}`)}
                      >
                        Read Full Article
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {articles.length === 0 && (
                  <div className="text-center py-8">
                    <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 mb-2">No news articles available</div>
                    <div className="text-sm text-gray-400">
                      Check back later for the latest educational news
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'events' && (
              <>
                {events.map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { day: '2-digit' }) : ''}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{event.event_location || 'Location TBD'}</p>
                        <p className="text-xs text-gray-700 line-clamp-2">{event.description}</p>
                        {event.event_date && (
                          <div className={`text-xs px-2 py-1 rounded inline-block mt-2 ${
                            getDaysLeft(event.event_date) <= 7 
                              ? 'text-red-600 bg-red-50' 
                              : 'text-orange-600 bg-orange-50'
                          }`}>
                            {getDaysLeft(event.event_date)} Days left
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 mb-2">No upcoming events</div>
                    <div className="text-sm text-gray-400">
                      Check back later for upcoming educational events
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/home')}
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
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
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

export default News;
