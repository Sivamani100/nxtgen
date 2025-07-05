import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Calendar, 
  ArrowLeft,
  BookOpen,
  Newspaper
} from "lucide-react";
import { toast } from "sonner";

interface SharedItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  external_link?: string;
  image_url?: string;
  created_at?: string;
  type?: string;
  location?: string;
  rating?: number;
}

const SharedContent = () => {
  const { itemType, itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<SharedItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!itemType || !itemId) {
      navigate('/404');
      return;
    }
    fetchSharedItem();
  }, [itemType, itemId]);

  const fetchSharedItem = async () => {
    try {
      setLoading(true);
      let data = null;
      
      // Convert itemId string to number
      const numericItemId = parseInt(itemId!, 10);
      if (isNaN(numericItemId)) {
        navigate('/404');
        return;
      }
      
      if (itemType === 'news' || itemType === 'resource') {
        // For flash popup resources, we can use mock data if it's one of our predefined resources
        if (itemType === 'resource' && (numericItemId === 1 || numericItemId === 2)) {
          const mockResources = [
            {
              id: 1,
              title: 'Top Engineering colleges list',
              description: 'We have select the top colleges for you',
              external_link: 'https://example.com/admission-guide.pdf',
              category: 'admission',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              title: 'Check out the notification',
              description: 'Eapcet council has released important updates',
              external_link: 'https://cets.apsche.ap.gov.in/EAPCET/Eapcet/EAPCET_HomePage.aspxs',
              category: 'notification',
              created_at: new Date().toISOString(),
            },
          ];
          
          data = mockResources.find(r => r.id === numericItemId);
        } else {
          // Try to fetch from database for other resources
          const { data: resourceData, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', numericItemId)
            .single();
          
          if (error) throw error;
          data = resourceData;
        }
      } else if (itemType === 'college') {
        const { data: collegeData, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', numericItemId)
          .single();
        
        if (error) throw error;
        data = collegeData;
      }

      if (data) {
        setItem(data);
      } else {
        navigate('/404');
      }
    } catch (error) {
      console.error('Error fetching shared item:', error);
      toast.error('Failed to load shared content');
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exam': return 'bg-blue-100 text-blue-800';
      case 'admission': return 'bg-green-100 text-green-800';
      case 'scholarship': return 'bg-purple-100 text-purple-800';
      case 'result': return 'bg-orange-100 text-orange-800';
      case 'notification': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenApp = () => {
    if (itemType === 'news' || itemType === 'resource') {
      navigate('/news');
    } else if (itemType === 'college') {
      navigate(`/college-details/${itemId}`);
    } else {
      navigate('/home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-4">The shared content could not be found.</p>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center text-sm text-gray-500">
            {itemType === 'news' || itemType === 'resource' ? (
              <Newspaper className="w-4 h-4 mr-1" />
            ) : (
              <BookOpen className="w-4 h-4 mr-1" />
            )}
            Shared {itemType}
          </div>
        </div>

        {/* Shared Content */}
        <Card className="bg-white shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            {item.category && (
              <Badge className={getCategoryColor(item.category)}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Badge>
            )}
            {(item.date || item.created_at) && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(item.date || item.created_at || '')}
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {item.title}
          </h1>

          {item.description && (
            <p className="text-gray-700 mb-4 leading-relaxed">
              {item.description}
            </p>
          )}

          {item.location && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Location:</strong> {item.location}
            </p>
          )}

          {item.rating && (
            <p className="text-sm text-gray-600 mb-4">
              <strong>Rating:</strong> {item.rating}/5
            </p>
          )}

          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}

          <div className="flex space-x-3">
            {item.external_link && (
              <Button
                onClick={() => window.open(item.external_link, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Link
              </Button>
            )}
            
            <Button
              onClick={handleOpenApp}
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50"
            >
              Open in NXTGEN App
            </Button>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Discover More with NXTGEN
          </h3>
          <p className="text-gray-600 mb-4">
            Get personalized college recommendations, latest updates, and much more!
          </p>
          <Button
            onClick={handleOpenApp}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Explore NXTGEN App
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SharedContent;
