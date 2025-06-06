import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, ExternalLink, Bookmark, BookmarkCheck, Share2, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  created_at: string;
  external_link?: string;
  is_featured: boolean;
  image_url?: string;
  source?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [savedNews, setSavedNews] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchSavedNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, categoryFilter, showSaved, savedNews]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .in('category', ['News', 'Event', 'Scholarship', 'Admission'])
        .order('created_at', { ascending: false });

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

      const { data, error } = await supabase
        .from('saved_news')
        .select('resource_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const savedIds = new Set(data?.map(item => item.resource_id) || []);
      setSavedNews(savedIds);
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  };

  const filterNews = () => {
    let filtered = [...news];

    if (showSaved) {
      filtered = filtered.filter(item => savedNews.has(item.id));
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredNews(filtered);
  };

  const handleSaveNews = async (newsId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save news');
        return;
      }

      const isSaved = savedNews.has(newsId);

      if (isSaved) {
        const { error } = await supabase
          .from('saved_news')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', newsId);

        if (error) throw error;
        
        setSavedNews(prev => {
          const newSet = new Set(prev);
          newSet.delete(newsId);
          return newSet;
        });
        
        toast.success('News removed from saved');
      } else {
        const { error } = await supabase
          .from('saved_news')
          .insert({
            user_id: user.id,
            resource_id: newsId
          });

        if (error) throw error;
        
        setSavedNews(prev => new Set([...prev, newsId]));
        toast.success('News saved successfully');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    }
  };

  const handleShare = async (newsItem: NewsItem, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.description,
          url: newsItem.external_link || window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(newsItem.external_link || window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(news.map(item => item.category))];
    return categories.sort();
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Latest News & Updates</h1>
            <Button 
              variant={showSaved ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSaved(!showSaved)}
              className={showSaved ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {showSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
              {showSaved ? 'All News' : 'Saved'}
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news and updates..."
                className="pl-10 text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="text-sm font-medium text-gray-700 mb-4">
          {showSaved ? `${filteredNews.length} saved items` : `${filteredNews.length} news found`}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNews.map((item) => (
            <Card 
              key={item.id} 
              className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${item.is_featured ? 'border-green-500 border-2' : ''}`}
              onClick={() => item.external_link && window.open(item.external_link, '_blank')}
            >
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    item.category === 'News' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'Event' ? 'bg-purple-100 text-purple-800' :
                    item.category === 'Scholarship' ? 'bg-green-100 text-green-800' :
                    item.category === 'Admission' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.category}
                  </span>
                  {item.is_featured && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => handleShare(item, e)}
                  >
                    <Share2 className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                    onClick={(e) => handleSaveNews(item.id, e)}
                  >
                    {savedNews.has(item.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
                
                {item.source && (
                  <span className="text-xs text-gray-500 font-medium">
                    Source: {item.source}
                  </span>
                )}
                
                {item.external_link && (
                  <div className="flex items-center text-blue-600 font-medium">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    <span className="text-sm">Read more</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-xl font-medium text-gray-600 mb-2">
              {showSaved ? 'No saved news found' : 'No news found'}
            </div>
            <div className="text-sm text-gray-500">
              {showSaved 
                ? 'Start saving news articles to see them here' 
                : 'Try adjusting your search criteria'
              }
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/home')}
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
              className="flex flex-col items-center space-y-[1px] p-1 text-green-600"
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

export default News;
