
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Trash2,
  BookOpen,
  Calendar,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface SavedNewsItem {
  id: number;
  resource_id: number;
  resources: {
    id: number;
    title: string;
    description: string;
    category: string;
    date: string;
    created_at: string;
    external_link?: string;
  };
}

const SavedNews = () => {
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedNews();
  }, []);

  const fetchSavedNews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('saved_news')
        .select(`
          id,
          resource_id,
          resources (
            id, title, description, category, date, created_at, external_link
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedNews(data || []);
    } catch (error) {
      console.error('Error fetching saved news:', error);
      toast.error('Failed to load saved news');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedNews = async (savedNewsId: number) => {
    try {
      const { error } = await supabase
        .from('saved_news')
        .delete()
        .eq('id', savedNewsId);

      if (error) throw error;

      setSavedNews(prev => prev.filter(item => item.id !== savedNewsId));
      toast.success('Removed from saved news');
    } catch (error) {
      console.error('Error removing saved news:', error);
      toast.error('Failed to remove saved news');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4 mt-16">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-pink-600" />
          <h1 className="text-xl font-bold text-gray-900">Saved News</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">Saved News</h1>
          </div>
          <p className="text-gray-600">Your saved news articles for easy access</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {savedNews.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No saved news yet</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6">
              Start exploring news and save your favorites for easy access
            </p>
            <Button 
              onClick={() => navigate('/news')}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Browse News
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 lg:mb-6">
              <p className="text-sm lg:text-base text-gray-600">
                {savedNews.length} news article{savedNews.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="space-y-4">
              {savedNews.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-4 lg:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getCategoryColor(item.resources.category)}>
                        {item.resources.category.charAt(0).toUpperCase() + item.resources.category.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(item.resources.date || item.resources.created_at)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedNews(item.id)}
                          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                      {item.resources.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.resources.description}
                    </p>

                    {/* Footer */}
                    {item.resources.external_link && (
                      <Button
                        onClick={() => window.open(item.resources.external_link, '_blank')}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Read More
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedNews;
