
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Calendar, Home as HomeIcon, Users, BookOpen, Newspaper, User, Heart, Share, Bookmark } from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  external_link?: string;
  source?: string;
  created_at: string;
  event_date?: string;
  event_location?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [savedNewsIds, setSavedNewsIds] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<'news' | 'saved'>('news');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchSavedNews();
  }, [activeTab]);

  const fetchNews = async () => {
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab !== 'All') {
        query = query.eq('category', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedNews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get saved news IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_news')
        .select('resource_id')
        .eq('user_id', user.id);

      if (savedError) throw savedError;
      
      const savedIds = new Set(savedData?.map(item => item.resource_id) || []);
      setSavedNewsIds(savedIds);

      // Get full saved news data
      if (savedIds.size > 0) {
        const { data: newsData, error: newsError } = await supabase
          .from('resources')
          .select('*')
          .in('id', Array.from(savedIds))
          .order('created_at', { ascending: false });

        if (newsError) throw newsError;
        setSavedNews(newsData || []);
      } else {
        setSavedNews([]);
      }
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  };

  const handleReadMore = (item: NewsItem) => {
    if (item.external_link) {
      window.open(item.external_link, '_blank', 'noopener,noreferrer');
    } else {
      toast.info('No external link available for this article');
    }
  };

  const handleSave = async (newsId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save articles');
        return;
      }

      const isSaved = savedNewsIds.has(newsId);

      if (isSaved) {
        // Unsave the article
        const { error } = await supabase
          .from('saved_news')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', newsId);

        if (error) throw error;

        setSavedNewsIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(newsId);
          return newSet;
        });
        
        // Remove from saved news list
        setSavedNews(prev => prev.filter(item => item.id !== newsId));
        toast.success('Article removed from saved');
      } else {
        // Save the article
        const { error } = await supabase
          .from('saved_news')
          .insert({
            user_id: user.id,
            resource_id: newsId
          });

        if (error) {
          if (error.code === '23505') {
            toast.error('Article already saved');
          } else {
            throw error;
          }
          return;
        }

        setSavedNewsIds(prev => new Set([...prev, newsId]));
        
        // Add to saved news list
        const savedItem = news.find(item => item.id === newsId);
        if (savedItem) {
          setSavedNews(prev => [savedItem, ...prev]);
        }
        toast.success('Article saved to favorites');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    }
  };

  const handleShare = (item: NewsItem) => {
    const shareUrl = `${window.location.origin}/news?article=${item.id}`;
    const shareText = `${item.title} - ${item.description}`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast.success('Share link copied to clipboard');
    }
  };

  const tabs = ['All', 'News', 'Event', 'Scholarship', 'Admission'];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Event':
        return <Calendar className="w-4 h-4" />;
      case 'Scholarship':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News':
        return 'bg-blue-100 text-blue-700';
      case 'Event':
        return 'bg-purple-100 text-purple-700';
      case 'Scholarship':
        return 'bg-green-100 text-green-700';
      case 'Admission':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const currentNews = viewMode === 'news' ? news : savedNews;

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
            <h1 className="text-lg font-semibold">Latest News & Updates</h1>
            <Button
              variant={viewMode === 'saved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(viewMode === 'news' ? 'saved' : 'news')}
            >
              <Bookmark className="w-4 h-4 mr-1" />
              {viewMode === 'news' ? 'Saved' : 'All News'}
            </Button>
          </div>
          
          {/* Tabs - only show when viewing all news */}
          {viewMode === 'news' && (
            <div className="flex overflow-x-auto space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex-shrink-0 px-3 py-2 text-xs ${
                    activeTab === tab 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {currentNews.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">
              {viewMode === 'saved' ? 'No saved news found' : 'No news found'}
            </div>
            <div className="text-sm text-gray-400">
              {viewMode === 'saved' 
                ? 'Save articles by tapping the heart icon'
                : 'Check back later for updates'
              }
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentNews.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                {/* Header with category and date */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center px-2 py-1 rounded text-xs ${getCategoryColor(item.category)}`}>
                      {getCategoryIcon(item.category)}
                      <span className="ml-1">{item.category}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {item.source && (
                    <div className="text-xs text-gray-600">
                      Source: {item.source}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Event specific info */}
                  {item.category === 'Event' && (item.event_date || item.event_location) && (
                    <div className="bg-purple-50 p-3 rounded mb-3">
                      {item.event_date && (
                        <div className="flex items-center text-xs text-purple-700 mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(item.event_date).toLocaleDateString()}
                        </div>
                      )}
                      {item.event_location && (
                        <div className="text-xs text-purple-600">
                          📍 {item.event_location}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => handleReadMore(item)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Read Full Article
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSave(item.id)}
                      className={savedNewsIds.has(item.id) ? 'bg-red-50 text-red-600 border-red-200' : ''}
                    >
                      <Heart className={`w-3 h-3 ${savedNewsIds.has(item.id) ? 'fill-red-600' : ''}`} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShare(item)}
                    >
                      <Share className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
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

export default News;
