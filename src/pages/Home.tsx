import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Newspaper,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Search,
  Filter,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import SaveNewsButton from "@/components/SaveNewsButton";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import FlashPopup from "@/components/FlashPopup";
import { useCollegeFilters } from "@/hooks/useCollegeFilters";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

interface NewsItem {
  id: number;
  title: string;
  content: string;
  link: string;
  date: string;
}

const Home = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFlashPopup, setShowFlashPopup] = useState(false);
  const { filters, applyFilters, updateFilters } = useCollegeFilters();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    
    // Check if flash popup should be shown (only once per session)
    const flashPopupShown = sessionStorage.getItem('flashPopupShown');
    if (!flashPopupShown) {
      setShowFlashPopup(true);
      sessionStorage.setItem('flashPopupShown', 'true');
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch news items
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('*')
        .limit(5);

      if (newsError) {
        console.error('Error fetching news:', newsError);
        toast.error('Failed to load news');
      } else {
        setNewsItems(newsData || []);
      }

      // Fetch scholarships
      const { data: scholarshipsData, error: scholarshipsError } = await supabase
        .from('scholarships')
        .select('*')
        .limit(5);

      if (scholarshipsError) {
        console.error('Error fetching scholarships:', scholarshipsError);
        toast.error('Failed to load scholarships');
      } else {
        setScholarships(scholarshipsData || []);
      }

      // Fetch popular colleges
      await fetchPopularColleges();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching popular colleges:', error);
        toast.error('Failed to load popular colleges');
      } else {
        setColleges(data || []);
      }
    } catch (error) {
      console.error('Error fetching popular colleges:', error);
      toast.error('Failed to load popular colleges');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
  };

  const handleFlashPopupClose = () => {
    setShowFlashPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Flash Popup */}
      <FlashPopup isOpen={showFlashPopup} onClose={handleFlashPopupClose} />

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">NXTGEN</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome to NXTGEN</h1>
          </div>
          <p className="text-gray-600">Explore top colleges, latest news, and scholarship opportunities</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Search Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <Input
              placeholder="Search for colleges..."
              className="pl-10 lg:pl-12 pr-12 h-12 lg:h-14 text-sm lg:text-base border-gray-200 focus:border-green-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterModal(true)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
            <Button
              onClick={handleSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 text-sm"
            >
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-900">Search Results</h4>
              {searchResults.map((college) => (
                <Card
                  key={college.id}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/college-details/${college.id}`)}
                >
                  <div className="p-4">
                    <h5 className="text-sm font-semibold text-gray-900">{college.name}</h5>
                    <p className="text-gray-600 text-xs">{college.location}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Colleges Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">Popular Colleges</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/colleges')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {colleges.map((college) => (
              <Card
                key={college.id}
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/college-details/${college.id}`)}
              >
                {college.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={college.image_url} 
                      alt={college.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4 lg:p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-blue-100 text-blue-800 text-xs font-medium">
                      {college.type}
                    </Badge>
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {college.name}
                  </h3>
                  
                  <div className="flex items-center text-xs lg:text-sm text-gray-600 mb-3">
                    <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-500" />
                    {college.location}
                  </div>

                  {college.description && (
                    <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">
                      {college.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 mr-1" />
                      <span className="font-semibold text-gray-900 text-xs lg:text-sm">{college.rating || 'N/A'}</span>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-green-600">
                      ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">Latest News</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/news')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {newsItems.map((item) => (
              <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <SaveNewsButton newsItemId={item.id} />
                  </div>
                  <p className="text-gray-600 text-xs line-clamp-2">{item.content}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-500 text-xs">
                      <Calendar className="w-3 h-3 mr-1 inline-block" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">
                      Read More
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Scholarship Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">Scholarship Opportunities</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/scholarships')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-4">
            {scholarships.map((scholarship) => (
              <Card key={scholarship.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{scholarship.title}</h3>
                  <p className="text-gray-600 text-xs line-clamp-2">{scholarship.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-500 text-xs">
                      <DollarSign className="w-3 h-3 mr-1 inline-block" />
                      {scholarship.amount}
                    </span>
                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs">
                      Apply Now
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default Home;
