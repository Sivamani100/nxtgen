import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search as SearchIcon, 
  MapPin, 
  Star, 
  GraduationCap,
  Filter,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { useCollegeFilters } from "@/hooks/useCollegeFilters";

interface College {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  total_fees_min: number;
  placement_percentage: number;
  image_url?: string;
  description?: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { filters: advancedFilters, setFilters: setAdvancedFilters, filteredColleges: advancedFilteredColleges } = useCollegeFilters(colleges);

  const collegeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'management', label: 'Management' },
    { value: 'arts', label: 'Arts' },
    { value: 'science', label: 'Science' }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchColleges();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setFilteredColleges([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    filterByType();
  }, [colleges, selectedType]);

  const searchColleges = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      console.log('Searching for:', searchQuery);
      
      let query = supabase
        .from('colleges')
        .select('*')
        .not('type', 'ilike', '%polytechnic%')
        .not('type', 'ilike', '%medical%');

      // Add search conditions including city and state
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,state.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data?.length || 0);
      setColleges(data || []);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    } finally {
      setLoading(false);
    }
  };

  const filterByType = () => {
    let filtered = colleges;
    
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = colleges.filter(college => 
        college.type.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Apply advanced filters
    const advancedFiltered = advancedFilteredColleges.filter(college => 
      filtered.some(f => f.id === college.id)
    );
    
    setFilteredColleges(advancedFiltered);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <SearchIcon className="w-6 h-6 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Search Colleges</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3 mb-2">
            <SearchIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Search Colleges</h1>
          </div>
          <p className="text-gray-600">Find the perfect college for your future</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {/* Search Section */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by college name, location, city, state, or type..."
              className="pl-10 lg:pl-12 pr-12 h-12 lg:h-14 text-sm lg:text-base border-gray-200 focus:border-green-500 shadow-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </Button>
            {loading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>

          {/* Type Filters */}
          {hasSearched && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0" />
              {collegeTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={`flex-shrink-0 text-xs lg:text-sm ${
                    selectedType === type.value
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {!hasSearched && !loading && (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Search for Colleges</h3>
              <p className="text-sm lg:text-base text-gray-600">
                Enter a college name, location, or type to get started
              </p>
            </div>
          )}

          {hasSearched && !loading && filteredColleges.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
              <p className="text-sm lg:text-base text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {hasSearched && filteredColleges.length > 0 && (
            <>
              <div className="mb-4 lg:mb-6">
                <p className="text-sm lg:text-base text-gray-600">
                  Found {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''} 
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredColleges.map((college) => (
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
            </>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onOpenChange={setShowFilterModal}
        onFiltersApply={setAdvancedFilters}
        currentFilters={advancedFilters}
      />
    </div>
  );
};

export default Search;
