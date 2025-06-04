
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, MapPin, Heart, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type College = Database['public']['Tables']['colleges']['Row'];

const Colleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    state: 'all',
    sortBy: 'rating'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
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

  const filterColleges = () => {
    let filtered = [...colleges];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(college => college.type === filters.type);
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

      toast.success('College saved to favorites');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-semibold mb-4">Browse Colleges</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-2">
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Autonomous">Autonomous</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.state} onValueChange={(value) => setFilters(prev => ({ ...prev, state: value }))}>
              <SelectTrigger>
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
              <SelectTrigger>
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
      <div className="max-w-md mx-auto p-4 pb-20">
        <div className="text-sm text-gray-600 mb-4">
          {filteredColleges.length} colleges found
        </div>
        
        <div className="space-y-4">
          {filteredColleges.map((college) => (
            <Card key={college.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/college-details/${college.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{college.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {college.location}, {college.state}
                  </div>
                  <div className="flex items-center space-x-3 text-sm mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{college.rating}/5.0</span>
                    </div>
                    <span className="text-green-600">
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
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{college.type}</span>
                <span className="text-xs text-gray-600">{college.placement_percentage}% placement</span>
              </div>
            </Card>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-2">No colleges found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search criteria
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-5 h-5" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/profile')}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Colleges;
