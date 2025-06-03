
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, MapPin, Star, Eye, Heart, Trash2, Filter, Home as HomeIcon, Users, BookOpen, Newspaper, User } from "lucide-react";
import { toast } from "sonner";

interface College {
  id: number;
  name: string;
  location: string;
  city: string;
  state: string;
  type: string;
  rating: number;
  image_url: string;
  total_fees_min: number;
  total_fees_max: number;
  description: string;
}

interface SavedCollege {
  id: number;
  college_id: number;
  colleges: College;
}

const Colleges = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchColleges();
    fetchSavedColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('rating', { ascending: false })
        .limit(20);

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
        .select(`
          id,
          college_id,
          colleges:college_id (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedColleges(data || []);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
        .order('rating', { ascending: false });

      if (error) throw error;
      setSearchResults(data || []);
      setShowSearch(true);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Search failed');
    }
  };

  const handleSaveCollege = async (collegeId: number) => {
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

      if (error) throw error;
      toast.success('College saved to favorites');
      fetchSavedColleges();
    } catch (error) {
      console.error('Error saving college:', error);
      toast.error('Failed to save college');
    }
  };

  const handleRemoveCollege = async (favoriteId: number) => {
    try {
      const { error } = await supabase
        .from('user_college_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      toast.success('College removed from favorites');
      setSavedColleges(prev => prev.filter(college => college.id !== favoriteId));
    } catch (error) {
      console.error('Error removing college:', error);
      toast.error('Failed to remove college');
    }
  };

  const formatFees = (min: number, max: number) => {
    if (min && max) {
      return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    }
    return 'Fees not available';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const displayColleges = showSearch ? searchResults : colleges;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Colleges</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges..."
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Saved Colleges */}
        {savedColleges.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Saved Colleges</h3>
              <Button variant="link" className="text-green-600 text-sm p-0">View All</Button>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {savedColleges.map((savedCollege) => (
                <Card key={savedCollege.id} className="flex-shrink-0 w-48 p-3">
                  <div className="h-24 bg-gradient-to-br from-blue-400 to-green-600 rounded mb-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 p-1 h-auto text-white hover:bg-white/20"
                      onClick={() => handleRemoveCollege(savedCollege.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center justify-center h-full">
                      <span className="text-white font-bold text-xs text-center px-2">
                        {savedCollege.colleges.name.substring(0, 15)}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm">{savedCollege.colleges.name}</h4>
                  <div className="flex items-center text-xs text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {savedCollege.colleges.city}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs">{savedCollege.colleges.rating}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="text-xs h-6 bg-green-600 hover:bg-green-700"
                      onClick={() => navigate(`/college-details/${savedCollege.colleges.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Colleges List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              {showSearch ? `Search Results (${searchResults.length})` : 'All Colleges'}
            </h3>
            {showSearch && (
              <Button 
                variant="link" 
                className="text-green-600 text-sm p-0"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {displayColleges.map((college) => (
              <Card key={college.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs text-center">
                      {college.name.substring(0, 8)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{college.name}</h4>
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {college.location}
                    </div>
                    <div className="flex items-center mb-2">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs mr-3">{college.rating}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{college.type}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{formatFees(college.total_fees_min, college.total_fees_max)}</p>
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveCollege(college.id);
                        }}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-xs h-6 bg-green-600 hover:bg-green-700"
                        onClick={() => navigate(`/college-details/${college.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {displayColleges.length === 0 && showSearch && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">No colleges found</div>
              <div className="text-sm text-gray-400">Try searching with different keywords</div>
            </div>
          )}
        </div>
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
