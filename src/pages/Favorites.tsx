
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star, MapPin, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SavedCollege {
  id: number;
  college_id: number;
  created_at: string;
  colleges: {
    id: number;
    name: string;
    location: string;
    rating: number;
    type: string;
    total_fees_min: number;
    total_fees_max: number;
    placement_percentage: number;
  };
}

const Favorites = () => {
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedColleges();
  }, []);

  const fetchSavedColleges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('user_college_favorites')
        .select(`
          id,
          college_id,
          created_at,
          colleges (
            id,
            name,
            location,
            rating,
            type,
            total_fees_min,
            total_fees_max,
            placement_percentage
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedColleges(data || []);
    } catch (error) {
      console.error('Error fetching saved colleges:', error);
      toast.error('Failed to load saved colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (favoriteId: number) => {
    try {
      const { error } = await supabase
        .from('user_college_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setSavedColleges(prev => prev.filter(item => item.id !== favoriteId));
      toast.success('College removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove college');
    }
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
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Saved Colleges</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {savedColleges.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-500 mb-2">No saved colleges yet</div>
            <div className="text-sm text-gray-400 mb-4">
              Start saving colleges you're interested in
            </div>
            <Button onClick={() => navigate('/colleges')} className="bg-green-600 hover:bg-green-700">
              Browse Colleges
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {savedColleges.length} saved college{savedColleges.length !== 1 ? 's' : ''}
            </div>
            
            {savedColleges.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 cursor-pointer" onClick={() => navigate(`/college-details/${item.colleges.id}`)}>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.colleges.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.colleges.location}
                    </div>
                    <div className="flex items-center space-x-3 text-sm mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{item.colleges.rating}/5.0</span>
                      </div>
                      <span className="text-green-600">
                        ₹{item.colleges.total_fees_min ? (item.colleges.total_fees_min / 100000).toFixed(1) : '0'}L - ₹{item.colleges.total_fees_max ? (item.colleges.total_fees_max / 100000).toFixed(1) : '0'}L
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.colleges.type}</span>
                      <span className="text-xs text-gray-600">{item.colleges.placement_percentage}% placement</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveFromFavorites(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Saved on {new Date(item.created_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
