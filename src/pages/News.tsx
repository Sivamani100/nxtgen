
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Newspaper, 
  Calendar, 
  ExternalLink, 
  Search,
  Filter,
  BookOpen,
  Clock,
  TrendingUp,
  Bookmark,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Categories' },
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
      console.log('Fetching news...');
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'news')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }

      console.log('Fetched news:', data?.length || 0, data);
      setNews(data || []);
      
      // If no news found, create some sample news for demonstration
      if (!data || data.length === 0) {
        console.log('No news found, creating sample news...');
        await createSampleNews();
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const createSampleNews = async () => {
    const sampleNews = [
      {
        title: 'TS EAMCET 2025 Results Declared',
        description: 'The Telangana State Engineering, Agriculture, and Pharmacy Common Entrance Test (TS EAMCET) 2025 results have been announced.',
        category: 'news',
        date: '2024-01-15',
        external_link: 'https://tseamcet.nic.in'
      },
      {
        title: 'AP EAPCET 2025 Admit Cards Released',
        description: 'The admit cards for the Andhra Pradesh Engineering, Agriculture, and Pharmacy Common Entrance Test (AP EAPCET) 2025 have been released.',
        category: 'news',
        date: '2024-01-10',
        external_link: 'https://sche.ap.gov.in'
      },
      {
        title: 'JEE Main 2024 Registration Opens',
        description: 'National Testing Agency (NTA) has opened the registration for JEE Main 2024. Students can apply online through the official website.',
        category: 'news',
        date: '2024-01-08',
        external_link: 'https://jeemain.nta.nic.in'
      },
      {
        title: 'NEET 2024 Exam Date Announced',
        description: 'The National Eligibility cum Entrance Test (NEET) 2024 will be conducted on May 5, 2024. Registration starts from February 9, 2024.',
        category: 'news',
        date: '2024-01-05',
        external_link: 'https://neet.nta.nic.in'
      },
      {
        title: 'BITSAT 2024 Application Process Begins',
        description: 'BITS Pilani has announced the opening of applications for BITSAT 2024. The online application process has begun.',
        category: 'news',
        date: '2024-01-03',
        external_link: 'https://www.bitsadmission.com'
      },
      {
        title: 'GATE 2024 Results Published',
        description: 'The Graduate Aptitude Test in Engineering (GATE) 2024 results have been published. Candidates can check their scores online.',
        category: 'news',
        date: '2024-01-01',
        external_link: 'https://gate.iitm.ac.in'
      },
      {
        title: 'CAT 2024 Registration Deadline Extended',
        description: 'The Common Admission Test (CAT) 2024 registration deadline has been extended to provide more time for aspiring candidates.',
        category: 'news',
        date: '2023-12-28',
        external_link: 'https://iimcat.ac.in'
      },
      {
        title: 'VITEEE 2024 Slot Booking Starts',
        description: 'VIT Engineering Entrance Examination (VITEEE) 2024 slot booking has commenced. Students can book their preferred exam slots.',
        category: 'news',
        date: '2023-12-25',
        external_link: 'https://viteee.vit.ac.in'
      }
    ];

    try {
      for (const newsItem of sampleNews) {
        await supabase.from('resources').insert([newsItem]);
      }
      
      // Fetch news again after creating samples
      const { data } = await supabase
        .from('resources')
        .select('*')
        .eq('category', 'news')
        .order('created_at', { ascending: false });
      
      setNews(data || []);
    } catch (error) {
      console.error('Error creating sample news:', error);
    }
  };

  const filterNews = () => {
    let filtered = news;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  };

  const formatDate = (dateString: string) => {
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
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Latest Updates</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2"
            >
              <Bookmark className="w-5 h-5 text-gray-600" />
            </Button>
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
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news and updates..."
              className="pl-10 lg:pl-12 h-12 lg:h-12 text-sm lg:text-base border-2 border-orange-200 focus:border-orange-400 rounded-xl"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600 whitespace-nowrap">All Categories</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            {categories.slice(1).map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`flex-shrink-0 text-xs lg:text-sm rounded-full ${
                  selectedCategory === category.value
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'border-orange-200 hover:bg-orange-50 text-orange-700'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Latest First Filter */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredNews.length} updates found
            </p>
            <Button variant="outline" size="sm" className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50">
              Latest First
            </Button>
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
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white border-2 border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => item.external_link && window.open(item.external_link, '_blank')}
              >
                <div className="p-4 lg:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-orange-100 text-orange-800 text-xs font-medium">
                      Admission
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(item.date || item.created_at)}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm lg:text-base text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Footer */}
                  {item.external_link && (
                    <div className="flex items-center text-sm text-orange-600 font-medium group-hover:text-orange-700">
                      <span>Read More</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
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
