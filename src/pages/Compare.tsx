
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, GitCompare, Star, MapPin, DollarSign, TrendingUp, Award, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface College {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  total_fees_min: number;
  total_fees_max: number;
  placement_percentage: number;
  highest_package: number;
  average_package: number;
  image_url?: string;
}

const Compare = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchColleges = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, type, rating, total_fees_min, total_fees_max, placement_percentage, highest_package, average_package, image_url')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%,type.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching colleges:', error);
      toast.error('Failed to search colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchColleges(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const addToComparison = (college: College) => {
    if (selectedColleges.length >= 4) {
      toast.error('You can compare maximum 4 colleges at a time');
      return;
    }

    if (selectedColleges.find(c => c.id === college.id)) {
      toast.error('College already added to comparison');
      return;
    }

    setSelectedColleges([...selectedColleges, college]);
    toast.success(`${college.name} added to comparison`);
  };

  const removeFromComparison = (collegeId: number) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const saveComparison = async () => {
    if (selectedColleges.length < 2) {
      toast.error('Please select at least 2 colleges to compare');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to save comparisons');
        return;
      }

      const { error } = await supabase
        .from('college_comparisons')
        .insert({
          user_id: user.id,
          college_ids: selectedColleges.map(c => c.id)
        });

      if (error) throw error;
      toast.success('Comparison saved successfully');
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast.error('Failed to save comparison');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <GitCompare className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
          </div>
          <p className="text-gray-600 text-lg">Select colleges to compare their features side by side</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 border border-gray-200">
          <div className="relative mb-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleges to add to comparison..."
              className="h-12 text-lg pl-12 pr-4 border-2 border-gray-200 focus:border-blue-500"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {searchResults.map((college) => (
                <div
                  key={college.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{college.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {college.location}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToComparison(college)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{college.rating}</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Selected Colleges for Comparison */}
        {selectedColleges.length > 0 && (
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Comparison ({selectedColleges.length}/4)
              </h2>
              <div className="space-x-2">
                <Button onClick={saveComparison} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  Save Comparison
                </Button>
                <Button onClick={() => setSelectedColleges([])} variant="outline">
                  Clear All
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Feature</th>
                    {selectedColleges.map((college) => (
                      <th key={college.id} className="text-center py-4 px-2 min-w-48">
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromComparison(college.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          {college.image_url && (
                            <img 
                              src={college.image_url} 
                              alt={college.name}
                              className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                            />
                          )}
                          <h3 className="font-bold text-gray-900 text-sm">{college.name}</h3>
                          <p className="text-xs text-gray-600">{college.location}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Type</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {college.type}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Rating</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-bold">{college.rating}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Fee Range</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <span className="text-green-600 font-bold">
                          ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L - 
                          ₹{college.total_fees_max ? (college.total_fees_max / 100000).toFixed(1) : '0'}L
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Placement Rate</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <span className="text-blue-600 font-bold">{college.placement_percentage}%</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Highest Package</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <span className="text-purple-600 font-bold">
                          ₹{college.highest_package ? (college.highest_package / 100000).toFixed(1) : '0'}L
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2 font-medium text-gray-900">Average Package</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <span className="text-orange-600 font-bold">
                          ₹{college.average_package ? (college.average_package / 100000).toFixed(1) : '0'}L
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-2 font-medium text-gray-900">Actions</td>
                    {selectedColleges.map((college) => (
                      <td key={college.id} className="py-4 px-2 text-center">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/college-details/${college.id}`)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          View Details
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {selectedColleges.length === 0 && (
          <Card className="p-12 text-center border border-gray-200">
            <GitCompare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Colleges Selected</h3>
            <p className="text-gray-600">Search and select colleges above to start comparing them</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;
