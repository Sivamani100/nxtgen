import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, ExternalLink, Heart, Bookmark } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-2 border-green-100">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Latest Updates
              </h1>
              <p className="text-gray-600 mt-1">Stay updated with the latest news and announcements</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`${showSavedOnly ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'} transition-colors`}
            >
              <Bookmark className="w-5 h-5 mr-2" />
              {showSavedOnly ? 'Show All' : 'Saved Only'}
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news and updates..."
                  className="pl-10 h-12 border-2 border-green-200 focus:border-green-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="h-12 border-2 border-blue-200 focus:border-blue-400">
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
                <SelectTrigger className="h-12 border-2 border-green-200 focus:border-green-400">
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
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md border-l-4 border-green-400">
          <p className="text-gray-700 font-medium">
            {filteredResources.length} {showSavedOnly ? 'saved' : ''} updates found
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300 bg-white transform hover:scale-105 overflow-hidden"
                  onClick={() => resource.external_link && window.open(resource.external_link, '_blank')}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border-2 bg-gradient-to-r ${getCategoryColor(resource.category)}`}>
                    {getCategoryIcon(resource.category)} {resource.category}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                  {resource.title}
                </h3>
                
                {resource.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {resource.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {resource.date ? new Date(resource.date).toLocaleDateString() : 
                     new Date(resource.created_at).toLocaleDateString()}
                  </div>
                  {resource.external_link && (
                    <div className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 group-hover:bg-green-100 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Read More
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-xl font-medium text-gray-600 mb-2">
              {showSavedOnly ? 'No saved news found' : 'No updates found'}
            </div>
            <div className="text-gray-500">
              {showSavedOnly ? 'Save some news to see them here' : 'Try adjusting your search criteria'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
