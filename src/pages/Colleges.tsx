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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [myColleges, setMyColleges] = useState<number[]>([]);

  useEffect(() => {
    fetchColleges();
    fetchSavedColleges();
    fetchMyColleges();
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

  const fetchMyColleges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("user_selected_colleges")
        .select("college_id")
        .eq("user_id", user.id);
      if (error) throw error;
      setMyColleges((data || []).map(item => item.college_id));
    } catch (error) {
      console.error('Error fetching my colleges:', error);
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
        navigate('/login');
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

  const handleSavedClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to view saved colleges');
        navigate('/login');
        return;
      }
      navigate('/favorites');
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
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

  const handleToggleMyCollege = async (collegeId: number, isChecked: boolean, event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    event.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please login to manage your list.");
      return;
    }
    if (isChecked) {
      // add
      const { error } = await supabase
        .from("user_selected_colleges")
        .insert({ user_id: user.id, college_id: collegeId });
      if (!error) {
        toast.success("Added to My Colleges!");
        setMyColleges(prev => [...prev, collegeId]);
      } else {
        toast.error("Could not add.");
      }
    } else {
      // remove
      const { error } = await supabase
        .from("user_selected_colleges")
        .delete()
        .eq("user_id", user.id)
        .eq("college_id", collegeId);
      if (!error) {
        toast.info("Removed from My Colleges.");
        setMyColleges(prev => prev.filter(id => id !== collegeId));
      } else {
        toast.error("Could not remove.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Colleges</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
            onClick={handleSavedClick}
          >
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
            className="w-full pl-10 h-10 text-base border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Mobile Filters */}
        <div className="flex space-x-2 mb-4">
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-1/3 h-10 border border-gray-300 rounded-md text-sm focus:border-blue-500">
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
            <SelectTrigger className="w-1/3 h-10 border border-gray-300 rounded-md text-sm focus:border-blue-500">
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
            <SelectTrigger className="w-1/3 h-10 border border-gray-300 rounded-md text-sm focus:border-blue-500">
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

        {/* Results Count */}
        <div className="bg-blue-100 p-2 rounded-md mb-4">
          <p className="text-sm font-medium text-blue-800">
            {filteredColleges.length} colleges found
          </p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Colleges</h1>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges by name, location, or state..."
              className="pl-12 h-12 text-base border border-gray-300 focus:border-blue-500 rounded-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-12 border border-gray-300 focus:border-blue-500">
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
              <SelectTrigger className="h-12 border border-gray-300 focus:border-blue-500">
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
              <SelectTrigger className="h-12 border border-gray-300 focus:border-blue-500">
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
        {/* College Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredColleges.map((college) => (
            <Card 
              key={college.id} 
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/college-details/${college.id}`)}
            >
              {/* College Image */}
              <div className="h-40 overflow-hidden">
                {college.image_url ? (
                  <img 
                    src={college.image_url} 
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {college.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-red-500" />
                      {college.location}, {college.state}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 hover:bg-red-50"
                      onClick={(e) => handleSaveCollege(college.id, e)}
                    >
                      <Heart 
                        className={`w-5 h-5 ${savedColleges.includes(college.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                      />
                    </Button>
                    <Checkbox
                      checked={myColleges.includes(college.id)}
                      onCheckedChange={async (checked) => {
                        if (checked) {
                          setMyColleges(prev => prev.includes(college.id) ? prev : [...prev, college.id]);
                        } else {
                          setMyColleges(prev => prev.filter(id => id !== college.id));
                        }
                        try {
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) {
                            toast.error("Please login to manage your list.");
                            return;
                          }
                          if (checked) {
                            const { error } = await supabase
                              .from("user_selected_colleges")
                              .insert({ user_id: user.id, college_id: college.id });
                            if (error) {
                              toast.error("Could not add.");
                              setMyColleges(prev => prev.filter(id => id !== college.id));
                            } else {
                              toast.success("Added to My Colleges!");
                            }
                          } else {
                            const { error } = await supabase
                              .from("user_selected_colleges")
                              .delete()
                              .eq("user_id", user.id)
                              .eq("college_id", college.id);
                            if (error) {
                              toast.error("Could not remove.");
                              setMyColleges(prev => [...prev, college.id]);
                            } else {
                              toast.info("Removed from My Colleges.");
                            }
                          }
                        } catch (err) {
                          toast.error("Action failed.");
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                      className="w-5 h-5 border-2 border-green-500 rounded-sm data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {college.rating}/5.0
                  </span>
                  <span>{college.placement_percentage}% placement</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  <span className="text-blue-600 mr-2">{college.type}</span>
                  <span className="text-green-600">₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L</span>
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
