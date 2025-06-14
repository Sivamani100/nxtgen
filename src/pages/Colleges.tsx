
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

const Colleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedColleges, setSavedColleges] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    state: 'all',
    sortBy: 'rating'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
    fetchSavedColleges();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [searchQuery, filters, colleges]);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_college_favorites')
        .select('college_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedColleges(data?.map(item => item.college_id) || []);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const filterColleges = () => {
    let filtered = [...colleges];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter with improved logic for grouping
    if (filters.type !== 'all') {
      filtered = filtered.filter(college => {
        if (!college.type) return false;
        
        const collegeType = college.type.toLowerCase();
        const filterType = filters.type.toLowerCase();
        
        switch (filterType) {
          case 'private':
            return collegeType.includes('private') || 
                   collegeType.includes('deemed') ||
                   collegeType.includes('autonomous');
          case 'government':
            return collegeType.includes('government') || 
                   collegeType.includes('public') ||
                   collegeType.includes('state') ||
                   collegeType.includes('central') ||
                   collegeType.includes('national');
          case 'university':
            return collegeType.includes('university');
          case 'engineering':
            return collegeType.includes('engineering');
          case 'medical':
            return collegeType.includes('medical');
          case 'polytechnic':
            return collegeType.includes('polytechnic');
          default:
            return collegeType === filterType;
        }
      });
    }

    // Apply state filter
    if (filters.state !== 'all') {
      filtered = filtered.filter(college => college.state === filters.state);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'fees_low':
          return (a.total_fees_min || 0) - (b.total_fees_min || 0);
        case 'fees_high':
          return (b.total_fees_min || 0) - (a.total_fees_min || 0);
        case 'placement':
          return (b.placement_percentage || 0) - (a.placement_percentage || 0);
        default:
          return 0;
      }
    });

    setFilteredColleges(filtered);
  };

  const handleSaveCollege = async (collegeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save colleges');
        return;
      }

      const isAlreadySaved = savedColleges.includes(collegeId);
      
      if (isAlreadySaved) {
        // Remove from saved
        const { error } = await supabase
          .from('user_college_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('college_id', collegeId);

        if (error) throw error;
        setSavedColleges(prev => prev.filter(id => id !== collegeId));
        toast.success('College removed from favorites');
      } else {
        // Add to saved
        const { error } = await supabase
          .from('user_college_favorites')
          .insert({
            user_id: user.id,
            college_id: collegeId
          });

        if (error) {
          if (error.code === '23505') {
            toast.error('College already saved');
          } else {
            throw error;
          }
          return;
        }

        setSavedColleges(prev => [...prev, collegeId]);
        toast.success('College saved to favorites');
      }
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    }
  };

  const getUniqueStates = () => {
    const states = [...new Set(colleges.map(college => college.state))];
    return states.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Browse Colleges</h1>
          <Button variant="ghost" size="sm" className="text-pink-500 hover:text-pink-600 hover:bg-pink-50">
            <Heart className="w-5 h-5 mr-1" />
            Saved
          </Button>
        </div>
        
        {/* Mobile Search */}
        <div className="relative mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges..."
            className="pl-10 h-12 text-base border-gray-200 focus:border-blue-400 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Mobile Filters */}
        <div className="flex space-x-2">
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="flex-1 h-10 border-gray-200 rounded-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="university">University</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="polytechnic">Polytechnic</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
            <SelectTrigger className="flex-1 h-10 border-gray-200 rounded-full">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {getUniqueStates().map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
            <SelectTrigger className="flex-1 h-10 border-gray-200 rounded-full">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="fees_low">Fees (Low to High)</SelectItem>
              <SelectItem value="fees_high">Fees (High to Low)</SelectItem>
              <SelectItem value="placement">Placement %</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Browse Colleges</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges by name, location, or state..."
              className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-400 rounded-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="university">University</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="polytechnic">Polytechnic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {getUniqueStates().map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="fees_low">Fees (Low to High)</SelectItem>
                <SelectItem value="fees_high">Fees (High to Low)</SelectItem>
                <SelectItem value="placement">Placement %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-700">
            {filteredColleges.length} colleges found
          </p>
        </div>
        
        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredColleges.map((college) => (
            <Card 
              key={college.id} 
              className="bg-white hover:shadow-xl transition-all duration-300 border hover:border-blue-300 cursor-pointer group overflow-hidden"
              onClick={() => navigate(`/college-details/${college.id}`)}
            >
              {/* College Image */}
              <div className="h-48 overflow-hidden">
                {college.image_url ? (
                  <img 
                    src={college.image_url} 
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {college.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-xs">No Image</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {college.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                      <span className="truncate">{college.location}, {college.state}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 ml-2 flex-shrink-0 hover:bg-red-50"
                    onClick={(e) => handleSaveCollege(college.id, e)}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        savedColleges.includes(college.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-bold text-gray-900 text-sm">{college.rating}/5.0</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {college.placement_percentage}% placement
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200 truncate">
                      {college.type}
                    </span>
                    <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                      ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-lg font-medium text-gray-600 mb-2">No colleges found</div>
            <div className="text-sm text-gray-500">
              Try adjusting your search criteria or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
