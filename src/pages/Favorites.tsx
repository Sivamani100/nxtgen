
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Share, ExternalLink, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Favorite {
  id: number;
  resource_id: number;
  created_at: string;
  resources: {
    id: number;
    category: string;
    title: string;
    description: string;
    date: string;
    details: any;
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          resource_id,
          created_at,
          resources!inner (
            id,
            category,
            title,
            description,
            date,
            details
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        toast.error("Error loading favorites");
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast.error("Error removing favorite");
        return;
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleShare = (resource: any) => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${resource.title} - ${window.location.href}`);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Saved Resources</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {favorites.length} saved resources
            </div>
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block mb-2">
                      {favorite.resources.category}
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">{favorite.resources.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{favorite.resources.description}</p>
                    <div className="text-xs text-gray-500">
                      Saved on {new Date(favorite.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(favorite.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2 mt-3">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShare(favorite.resources)}
                  >
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 mb-2">No saved resources yet</div>
            <div className="text-sm text-gray-400 mb-4">
              Start exploring and save resources you're interested in
            </div>
            <Button 
              onClick={() => navigate('/search')}
              className="bg-green-600 hover:bg-green-700"
            >
              Explore Resources
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
