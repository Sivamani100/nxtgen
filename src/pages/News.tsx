import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, ExternalLink, Heart, Home as HomeIcon, Users, BookOpen, Newspaper, User, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Resource = Database['public']['Tables']['resources']['Row'];

const News = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedNews, setSavedNews] = useState<number[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'date'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
    fetchSavedNews();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchQuery, filters, resources, showSavedOnly]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
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
      setSavedNews(data?.map(item => item.resource_id) || []);
    } catch (error) {
      console.error('Error fetching saved news:', error);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (showSavedOnly) {
      filtered = filtered.filter(resource => savedNews.includes(resource.id));
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(resource => resource.category === filters.category);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  };

  const handleSaveNews = async (resourceId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save news');
        return;
      }

      const isAlreadySaved = savedNews.includes(resourceId);
      
      if (isAlreadySaved) {
        const { error } = await supabase
          .from('saved_news')
          .delete()
          .eq('user_id', user.id)
          .eq('resource_id', resourceId);

        if (error) throw error;
        setSavedNews(prev => prev.filter(id => id !== resourceId));
        toast.success('News removed from saved');
      } else {
        const { error } = await supabase
          .from('saved_news')
          .insert({
            user_id: user.id,
            resource_id: resourceId
          });

        if (error) {
          if (error.code === '23505') {
            toast.error('News already saved');
          } else {
            throw error;
          }
          return;
        }

        setSavedNews(prev => [...prev, resourceId]);
        toast.success('News saved successfully');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'events': return '🎉';
      case 'admissions': return '🎓';
      case 'scholarships': return '💰';
      case 'results': return '📊';
      case 'notifications': return '📢';
      default: return '📰';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'events': return 'from-purple-100 to-pink-100 border-purple-300 text-purple-800';
      case 'admissions': return 'from-blue-100 to-indigo-100 border-blue-300 text-blue-800';
      case 'scholarships': return 'from-green-100 to-emerald-100 border-green-300 text-green-800';
      case 'results': return 'from-orange-100 to-red-100 border-orange-300 text-orange-800';
      case 'notifications': return 'from-yellow-100 to-amber-100 border-yellow-300 text-yellow-800';
      default: return 'from-gray-100 to-slate-100 border-gray-300 text-gray-800';
    }
  };

  const getUniqueCategories = () => {
    const categories = [...new Set(resources.map(resource => resource.category))];
    return categories.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-orange-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Latest Updates</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`${showSavedOnly ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
            >
              <Bookmark className="w-5 h-5 mr-2" />
              Saved
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news and updates..."
              className="pl-10 text-base border-2 border-orange-200 focus:border-orange-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryIcon(category)} {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="border-2 border-pink-200 focus:border-pink-400">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Latest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <div className="text-sm font-medium text-gray-700 mb-4 bg-white rounded-lg p-3 shadow-md border-l-4 border-orange-400">
          {filteredResources.length} {showSavedOnly ? 'saved' : ''} updates found
        </div>
        
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 bg-white transform hover:scale-[1.02]"
                  onClick={() => resource.external_link && window.open(resource.external_link, '_blank')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`}>
                      {getCategoryIcon(resource.category)} {resource.category}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1"
                      onClick={(e) => handleSaveNews(resource.id, e)}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          savedNews.includes(resource.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`} 
                      />
                    </Button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-base text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  {resource.date ? new Date(resource.date).toLocaleDateString() : 
                   new Date(resource.created_at).toLocaleDateString()}
                </div>
                {resource.external_link && (
                  <div className="flex items-center text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Read More
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <div className="text-lg font-medium text-gray-600 mb-2">
              {showSavedOnly ? 'No saved news found' : 'No updates found'}
            </div>
            <div className="text-sm text-gray-500">
              {showSavedOnly ? 'Save some news to see them here' : 'Try adjusting your search criteria'}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-blue-600"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-7 h-7" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-purple-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-7 h-7" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-7 h-7" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-orange-600 bg-orange-50"
            >
              <Newspaper className="w-7 h-7" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-indigo-600"
              onClick={() => navigate('/profilePage')}
            >
              <User className="w-7 h-7" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
