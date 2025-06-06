import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Heart, Home as HomeIcon, Users, BookOpen, Newspaper, User, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { BottomNavigation } from "@/components/BottomNavigation";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white shadow-lg p-4 border-b-2 border-blue-100">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Browse Colleges</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/favorites')}
                className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
              >
                <HeartHandshake className="w-5 h-5 mr-2" />
                Saved
              </Button>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges..."
                className="pl-10 text-base border-2 border-blue-200 focus:border-blue-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-2">
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
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
                <SelectTrigger className="border-2 border-green-200 focus:border-green-400">
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
                <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="fees_low">Fees (Low)</SelectItem>
                  <SelectItem value="fees_high">Fees (High)</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-md mx-auto p-4 pb-24">
          <div className="text-sm font-medium text-gray-700 mb-4 bg-white rounded-lg p-3 shadow-md border-l-4 border-blue-400">
            {filteredColleges.length} colleges found
          </div>
          
          <div className="space-y-4">
            {filteredColleges.map((college) => (
              <Card key={college.id} className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 bg-white"
                    onClick={() => navigate(`/college-details/${college.id}`)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{college.name}</h3>
                    <div className="flex items-center text-base text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      {college.location}, {college.state}
                    </div>
                    <div className="flex items-center space-x-3 text-sm mb-2">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-bold text-gray-900">{college.rating}/5.0</span>
                      </div>
                      <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={(e) => handleSaveCollege(college.id, e)}
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        savedColleges.includes(college.id) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-gray-400 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200">
                    {college.type}
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {college.placement_percentage}% placement
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <div className="text-lg font-medium text-gray-600 mb-2">No colleges found</div>
              <div className="text-sm text-gray-500">
                Try adjusting your search criteria
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
};

export default Colleges;
