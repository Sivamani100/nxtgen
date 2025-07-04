
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  MapPin, 
  Star, 
  Users, 
  DollarSign,
  Search,
  Filter,
  Heart,
  ExternalLink,
  Building
} from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

type College = Tables<"colleges">;

const Colleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const states = [
    'all', 'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'
  ];

  const collegeTypes = [
    'all', 'Government', 'Private', 'Deemed', 'Autonomous'
  ];

  useEffect(() => {
    fetchColleges();
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterColleges();
  }, [colleges, searchQuery, selectedState, selectedType]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_college_favorites')
        .select('college_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(new Set(data?.map(fav => fav.college_id).filter(Boolean) || []));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const toggleFavorite = async (collegeId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save favorites');
        return;
      }

      if (favorites.has(collegeId)) {
        const { error } = await supabase
          .from('user_college_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('college_id', collegeId);

        if (error) throw error;
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(collegeId);
          return newFavorites;
        });
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('user_college_favorites')
          .insert({ user_id: user.id, college_id: collegeId });

        if (error) throw error;
        setFavorites(prev => new Set([...prev, collegeId]));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const filterColleges = () => {
    let filtered = colleges;

    if (searchQuery.trim()) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState !== 'all') {
      filtered = filtered.filter(college => college.state === selectedState);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(college => college.type === selectedType);
    }

    setFilteredColleges(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <Building className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Browse Colleges</h1>
              </div>
              <p className="text-gray-600">Discover and compare top engineering colleges</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/favorites')}
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Saved</span>
            </Button>
          </div>

          {/* Desktop Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colleges, locations..."
                className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state === 'all' ? 'All States' : state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {collegeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search - Only show on mobile - removed spacing */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4 mt-16">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges..."
            className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 rounded-lg"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <span className="text-sm text-gray-600">
            {filteredColleges.length} colleges found
          </span>
        </div>

        {showFilters && (
          <div className="space-y-3 mb-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state === 'all' ? 'All States' : state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {collegeTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {filteredColleges.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Colleges Found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredColleges.map((college) => (
              <Card 
                key={college.id} 
                className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/colleges/${college.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {college.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{college.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {college.type}
                        </Badge>
                        {college.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium ml-1">{college.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(college.id);
                      }}
                      className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favorites.has(college.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>

                  {college.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {college.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {college.total_fees_min && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-blue-700 font-medium">Fees</div>
                        <div className="text-sm font-bold text-blue-900">
                          ₹{(college.total_fees_min / 100000).toFixed(1)}L+
                        </div>
                      </div>
                    )}
                    
                    {college.placement_percentage && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs text-green-700 font-medium">Placement</div>
                        <div className="text-sm font-bold text-green-900">
                          {college.placement_percentage}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Details
                    </div>
                    {college.eligible_exams && college.eligible_exams.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {college.eligible_exams.slice(0, 2).join(', ')}
                        {college.eligible_exams.length > 2 && ' +more'}
                      </div>
                    )}
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

export default Colleges;
