
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Newspaper, 
  Filter,
  BookOpen,
  Clock,
  ExternalLink,
  Search
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
  created_at: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'admission', label: 'Admissions' },
    { value: 'exam', label: 'Exams' },
    { value: 'scholarship', label: 'Scholarships' },
    { value: 'result', label: 'Results' },
    { value: 'notification', label: 'Notifications' }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchQuery, selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'news')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNews(data || []);
    } catch (error) {
      toast.error('Failed to load news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news;
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    setFilteredNews(filtered);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center p-4">
          <Newspaper className="w-6 h-6 text-green-600 mr-2" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Latest News</h1>
            <p className="text-xs text-gray-600">Stay updated with announcements</p>
          </div>
        </div>
      </div>
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center mb-2">
            <Newspaper className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest announcements and updates</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="pl-10 lg:pl-12 h-10 lg:h-12 text-sm lg:text-base border-gray-200 focus:border-green-500"
            />
          </div>
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
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        {/* News Content */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              {news.length === 0 ? 'No News Available' : 'No Results Found'}
            </h3>
            <p className="text-sm lg:text-base text-gray-600">
              {news.length === 0 
                ? 'Check back later for the latest updates and announcements.'
                : 'Try adjusting your search terms or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredNews.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => item.external_link && window.open(item.external_link, '_blank')}
              >
                <div className="p-4 lg:p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(item.date || item.created_at)}
                    </div>
                  </div>
                  {/* Content */}
                  <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-gray-600 mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  {/* Footer */}
                  {item.external_link && (
                    <div className="flex items-center text-xs lg:text-sm text-green-600 font-medium group-hover:text-green-700">
                      <span>Read More</span>
                      <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
                    </div>
                  )}
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
