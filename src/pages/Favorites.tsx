
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MapPin, 
  Star, 
  GraduationCap, 
  Trash2,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

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

const Favorites = () => {
  const [favoriteColleges, setFavoriteColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteColleges();
  }, []);

  const fetchFavoriteColleges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('user_college_favorites')
        .select(`
          college_id,
          colleges (
            id, name, location, type, rating, total_fees_min, placement_percentage, image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const colleges = data?.map(item => item.colleges).filter(Boolean) as College[];
      setFavoriteColleges(colleges || []);
    } catch (error) {
      console.error('Error fetching favorite colleges:', error);
      toast.error('Failed to load favorite colleges');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (collegeId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_college_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('college_id', collegeId);

      if (error) throw error;

      setFavoriteColleges(prev => prev.filter(college => college.id !== collegeId));
      toast.success('Removed from favorites');
    } catch (error)

 {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-pink-600" />
          <h1 className="text-xl font-bold text-gray-900">Favorite Colleges</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold text-gray-900">Favorite Colleges</h1>
          </div>
          <p className="text-gray-600">Your saved colleges for easy access</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        {favoriteColleges.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No favorite colleges yet</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6">
              Start exploring colleges and save your favorites for easy access
            </p>
            <Button 
              onClick={() => navigate('/colleges')}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Browse Colleges
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 lg:mb-6">
              <p className="text-sm lg:text-base text-gray-600">
                {favoriteColleges.length} college{favoriteColleges.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {favoriteColleges.map((college) => (
                <Card
                  key={college.id}
                  className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group"
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(college.id)}
                        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-2 line-clamp-2">
                      {college.name}
                    </h3>
                    
                    <div className="flex items-center text-xs lg:text-sm text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-500" />
                      {college.location}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold text-gray-900 text-xs lg:text-sm">{college.rating}</span>
                      </div>
                      <span className="text-xs lg:text-sm font-medium text-green-600">
                        ₹{college.total_fees_min ? (college.total_fees_min / 100000).toFixed(1) : '0'}L/year
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => navigate(`/college-details/${college.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 lg:h-9 text-xs lg:text-sm"
                      >
                        <GraduationCap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
