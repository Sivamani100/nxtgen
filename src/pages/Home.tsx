import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  MapPin,
  Star,
  GraduationCap,
  Search,
  Filter,
  BookOpen,
  Clock,
  TrendingUp,
  ArrowRight,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import SaveNewsButton from "@/components/SaveNewsButton";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { useCollegeFilters } from "@/hooks/useCollegeFilters";
import { Filter } from "lucide-react";

interface College {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  total_fees_min: number;
  placement_percentage: number;
  image_url?: string;
}

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

interface Profile {
  full_name: string;
}

const Home = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { filters: collegeFilters, applyFilters, updateFilters } = useCollegeFilters();

  // College shortcut mappings for better search
  const collegeShortcuts: Record<string, string[]> = {
    "ggu": ["godavari global university"],
    "iit": ["indian institute of technology"],
    "nit": ["national institute of technology"],
    "iiit": ["indian institute of information technology"],
    "vit": ["vellore institute of technology"],
    "srm": ["srm institute of science and technology"],
    "lpu": ["lovely professional university"],
    "mit": ["manipal institute of technology"],
    "bits": ["birla institute of technology and science"],
    "dtu": ["delhi technological university"],
    "nsut": ["netaji subhas university of technology"],
    "jnu": ["jawaharlal nehru university"],
    "du": ["delhi university"],
    "bhu": ["banaras hindu university"],
    "amu": ["aligarh muslim university"],
    "jmi": ["jamia millia islamia"],
    "cbit": ["chaitanya bharathi institute of technology"],
    "vnit": ["visvesvaraya national institute of technology"],
    "manit": ["maulana azad national institute of technology"],
    "nifft": ["national institute of foundry and forge technology"],
    "pdeu": ["pandit deendayal energy university"],
    "thapar": ["thapar institute of engineering and technology"],
    "lnmiit": ["lnm institute of information technology"],
    "jecrc": ["jecrc university"],
    "poornima": ["poornima college of engineering"],
    "rtu": ["rajasthan technical university"],
    "ktu": ["kerala technological university"],
    "anna": ["anna university"],
    "osmania": ["osmania university"],
    "kakatiya": ["kakatiya university"],
    "jntu": ["jawaharlal nehru technological university"],
    "ou": ["osmania university"],
    "ku": ["kakatiya university"],
    "svs": ["sri venkateswara university"],
    "au": ["andhra university"],
    "gitam": ["gandhi institute of technology and management"],
    "vignan": ["vignan university"],
    "klef": ["koneru lakshmaiah education foundation"],
    "vrsec": ["velagapudi ramakrishna siddhartha engineering college"],
    "gmrit": ["gmr institute of technology"],
    "sicet": ["srinivasa institute of engineering and technology"],
    "cmrit": ["cmr institute of technology"],
    "mrcet": ["malla reddy college of engineering and technology"],
    "mgit": ["mahatma gandhi institute of technology"],
    "cvsr": ["cvr college of engineering"],
    "snist": ["sreenidhi institute of science and technology"],
    "vce": ["vardhaman college of engineering"],
    "mjcet": ["muffakham jah college of engineering and technology"],
    "hits": ["hyderabad institute of technology and management"],
    "iare": ["institute of aeronautical engineering"],
    "mlrit": ["marri laxman reddy institute of technology"],
    "vnrvjiet": ["vallurupalli nageswara rao vignana jyothi institute of engineering and technology"],
    "ace": ["anurag college of engineering"],
    "bvrit": ["b v raju institute of technology"],
    "griet": ["gokaraju rangaraju institute of engineering and technology"],
    "mvsr": ["mvsr engineering college"],
    "cmrtc": ["cmr technical campus"],
    "kitsw": ["kakatiya institute of technology and science for women"],
    "uceou": ["university college of engineering osmania university"],
    "jntuh": ["jawaharlal nehru technological university hyderabad"],
    "jntuk": ["jawaharlal nehru technological university kakinada"],
    "jntua": ["jawaharlal nehru technological university anantapur"],
    "svuce": ["sri venkateswara university college of engineering"],
    "aucoe": ["andhra university college of engineering"],
    "rgukt": ["rajiv gandhi university of knowledge technologies"],
    "iiits": ["indian institute of information technology sri city"],
    "iiitdm": ["indian institute of information technology design and manufacturing"],
    "nitw": ["national institute of technology warangal"],
    "nitk": ["national institute of technology karnataka"],
    "nitc": ["national institute of technology calicut"],
    "nitr": ["national institute of technology rourkela"],
    "nitd": ["national institute of technology durgapur"],
    "nita": ["national institute of technology agartala"],
    "nitap": ["national institute of technology arunachal pradesh"],
    "nitgoa": ["national institute of technology goa"],
    "nith": ["national institute of technology hamirpur"],
    "nitj": ["national institute of technology jalandhar"],
    "nitjsr": ["national institute of technology jamshedpur"],
    "nitkkr": ["national institute of technology kurukshetra"],
    "nitm": ["national institute of technology manipur"],
    "nitp": ["national institute of technology patna"],
    "nitrr": ["national institute of technology raipur"],
    "nitsilchar": ["national institute of technology silchar"],
    "nitt": ["national institute of technology tiruchirappalli"],
    "nitu": ["national institute of technology uttarakhand"],
    "nitdelhi": ["national institute of technology delhi"],
    "nitandhra": ["national institute of technology andhra pradesh"],
    "nitpuducherry": ["national institute of technology puducherry"],
    "nitmizoram": ["national institute of technology mizoram"],
    "nitmeghalaya": ["national institute of technology meghalaya"],
    "nitnagaland": ["national institute of technology nagaland"]
  };

  useEffect(() => {
    Promise.all([
      fetchPopularColleges(),
      fetchLatestNews(),
      fetchUserProfile()
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]); // Get first name only
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchPopularColleges = async () => {
    try {
      console.log('Fetching popular colleges...');
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, type, rating, total_fees_min, placement_percentage, image_url')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%')
        .order('rating', { ascending: false })
        .limit(6);

      if (error) throw error;
      console.log('Popular colleges fetched:', data?.length || 0);
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchLatestNews = async () => {
    try {
      // Fetch from resources table
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, category, date, image_url, external_link, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      console.log('Latest news fetched:', data?.length || 0);
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const query = searchQuery.toLowerCase().trim();
      
      // Check if the search query is a shortcut
      let searchTerms = [query];
      for (const [shortcut, expansions] of Object.entries(collegeShortcuts)) {
        if (query.includes(shortcut)) {
          searchTerms = [...searchTerms, ...expansions];
          break;
        }
      }

      // Create OR condition for all search terms
      const orConditions = searchTerms.map(term => 
        `name.ilike.%${term}%,location.ilike.%${term}%,type.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`
      ).join(',');

      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, city, state, type, rating, total_fees_min, placement_percentage, image_url')
        .or(orConditions)
        .limit(50);

      if (error) throw error;
      
      // Apply filters to search results
      const filteredResults = applyFilters(data || [], collegeFilters);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
    // Re-apply search with new filters
    if (searchQuery.trim()) {
      handleSearch();
    }
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

  const displayedColleges = searchQuery.trim() ? searchResults : colleges;

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* Welcome Header with Search */}
      <section className="bg-white border-b border-gray-100 py-4 lg:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Welcome Back{userName ? `, ${userName}!` : '!'}
              </h1>
              <p className="text-sm lg:text-base text-gray-600">Find your perfect college</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges, courses, news... (try shortcuts like 'ggu', 'iit', 'nit')"
              className="pl-10 pr-12 h-12 text-base border-gray-200 focus:border-green-500 rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterModal(true)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
            {isSearching && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Section - Hidden on mobile, visible on desktop */}
      <section className="hidden lg:block bg-gradient-to-br from-green-50 to-blue-50 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                Your Future Starts Here
              </h1>
              <p className="text-lg lg:text-xl text-gray-700 mb-8">
                Explore colleges, courses, and career opportunities.
              </p>
              <div className="space-x-3">
                <Button size="lg" onClick={() => navigate('/colleges')}>
                  Explore Colleges
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/predictor')}>
                  Predict Your Rank
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results or Popular Colleges Section */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">
                {searchQuery.trim() ? `Search Results (${searchResults.length})` : 'Popular Colleges'}
              </h2>
              <p className="text-sm lg:text-base text-gray-600">
                {searchQuery.trim() ? `Results for "${searchQuery}"` : 'Discover top-rated institutions'}
              </p>
            </div>
            {!searchQuery.trim() && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/colleges')}
                className="text-sm lg:text-base hover:bg-green-50 hover:border-green-300"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : displayedColleges.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery.trim() ? 'No colleges found' : 'No colleges available'}
              </h3>
              <p className="text-gray-600">
                {searchQuery.trim() ? 'Try adjusting your search terms or use shortcuts like "ggu", "iit", "nit"' : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {displayedColleges.map((college) => (
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
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-100 text-blue-800 text-xs font-medium">
                        {college.type}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold text-gray-900 text-xs lg:text-sm">{college.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {college.name}
                    </h3>
                    
                    <div className="flex items-center text-xs lg:text-sm text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-500" />
                      {college.location}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-sm font-medium text-green-600">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                      </span>
                      {college.placement_percentage && (
                        <span className="text-xs lg:text-sm font-medium text-blue-600">
                          {college.placement_percentage}% Placed
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-8 lg:py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div>
              <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Latest News</h2>
              <p className="text-sm lg:text-base text-gray-600">Stay updated with announcements</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/news')}
              className="text-sm lg:text-base hover:bg-blue-50 hover:border-blue-300"
            >
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-8">
              <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {news.map((item) => (
                <Card 
                  key={item.id} 
                  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
                  onClick={() => item.external_link && window.open(item.external_link, '_blank')}
                >
                  <div className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(item.date || item.created_at)}
                        </div>
                        <SaveNewsButton newsId={item.id} />
                      </div>
                    </div>

                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-600 mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    {item.external_link && (
                      <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
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
      </section>

      {/* Quick Actions Section */}
      <section className="py-8 lg:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/colleges')}>
              <div className="text-center">
                <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Explore Colleges
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Find the right college for you
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/predictor')}>
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Predict Your Rank
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Know your potential rank
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/search')}>
              <div className="text-center">
                <Search className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Search Colleges
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Find colleges by name or location
                </p>
              </div>
            </Card>
            <Card className="p-4 lg:p-5 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/news')}>
              <div className="text-center">
                <Newspaper className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1">
                  Latest News
                </h3>
                <p className="text-xs lg:text-sm text-gray-600">
                  Stay updated with the latest news
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={collegeFilters}
      />
    </div>
  );
};

export default Home;
