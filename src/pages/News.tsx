
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar, 
  ExternalLink, 
  Newspaper,
  Filter,
  Clock,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  image_url?: string;
  external_link?: string;
  source?: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'admissions', label: 'Admissions' },
    { value: 'exams', label: 'Exams' },
    { value: 'scholarships', label: 'Scholarships' },
    { value: 'events', label: 'Events' },
    { value: 'announcements', label: 'Announcements' }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, selectedCategory]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'news')
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

  const filterNews = () => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredNews(filtered);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      admissions: 'bg-blue-100 text-blue-800',
      exams: 'bg-green-100 text-green-800',
      scholarships: 'bg-purple-100 text-purple-800',
      events: 'bg-orange-100 text-orange-800',
      announcements: 'bg-red-100 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <Newspaper className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Latest News</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest educational news and announcements</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="pl-10 lg:pl-12 h-10 lg:h-12 text-sm lg:text-base border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`flex-shrink-0 text-xs lg:text-sm ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News List */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No news found</h3>
            <p className="text-sm lg:text-base text-gray-600">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Check back later for updates.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => item.external_link ? window.open(item.external_link, '_blank') : null}
              >
                {item.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={item.image_url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4 lg:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getCategoryColor(item.category)} text-xs font-medium`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      {item.external_link && (
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-sm lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs lg:text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      {item.source && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                          {item.source}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
