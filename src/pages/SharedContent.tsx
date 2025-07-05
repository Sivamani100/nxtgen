
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
  Newspaper,
  FileText
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
    console.log('SharedContent mounted with params:', { itemType, itemId });
    if (!itemType || !itemId) {
      console.log('Missing itemType or itemId, redirecting to 404');
      toast.error('Invalid share link');
      navigate('/home');
      return;
    }
    fetchSharedItem();
  }, [itemType, itemId]);

  const fetchSharedItem = async () => {
    try {
      setLoading(true);
      console.log('Fetching shared item:', { itemType, itemId });
      
      // Convert itemId string to number
      const numericItemId = parseInt(itemId!, 10);
      if (isNaN(numericItemId)) {
        console.log('Invalid itemId, not a number:', itemId);
        toast.error('Invalid share link');
        navigate('/home');
        return;
      }
      
      let data = null;
      
      if (itemType === 'resource') {
        // Handle flash popup resources with mock data
        if (numericItemId === 1 || numericItemId === 2) {
          const mockResources = [
            {
              id: 1,
              title: 'Top Engineering colleges list',
              description: 'We have selected the top colleges for you. This comprehensive guide includes rankings, admission criteria, and important details about the best engineering institutions.',
              external_link: 'https://aqmsxrqybxsjsigqnimp.supabase.co/storage/v1/object/public/files//AP%20TOP%20ENGINEERING%20COLLEGES.pdf',
              category: 'admission',
              type: 'PDF',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              title: 'Check out the notification',
              description: 'EAPCET council has released important updates regarding admission process, counselling schedules, and other critical information.',
              external_link: 'https://cets.apsche.ap.gov.in/EAPCET/Eapcet/EAPCET_HomePage.aspxs',
              category: 'notification',
              type: 'Link',
              created_at: new Date().toISOString(),
            },
          ];
          
          data = mockResources.find(r => r.id === numericItemId);
          console.log('Found resource in mock data:', data);
        } else {
          // Try to fetch from database for other resources
          console.log('Fetching from database for resource id:', numericItemId);
          const { data: resourceData, error } = await supabase
            .from('resources')
            .select('*')
            .eq('id', numericItemId)
            .single();
          
          if (error) {
            console.log('Database error:', error);
            throw error;
          }
          data = resourceData;
        }
      } else if (itemType === 'news') {
        console.log('Fetching news from database for id:', numericItemId);
        const { data: newsData, error } = await supabase
          .from('resources')
          .select('*')
          .eq('id', numericItemId)
          .single();
        
        if (error) {
          console.log('Database error for news:', error);
          throw error;
        }
        data = newsData;
      } else if (itemType === 'college') {
        console.log('Fetching college from database for id:', numericItemId);
        const { data: collegeData, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', numericItemId)
          .single();
        
        if (error) {
          console.log('Database error for college:', error);
          throw error;
        }
        data = collegeData;
      }

      if (data) {
        console.log('Successfully found item:', data);
        setItem(data);
      } else {
        console.log('No data found for item');
        toast.error('Content not found');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error fetching shared item:', error);
      toast.error('Failed to load shared content');
      navigate('/home');
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

  const getIcon = () => {
    if (itemType === 'resource') {
      return item?.type === 'PDF' ? <FileText className="w-4 h-4 mr-1" /> : <ExternalLink className="w-4 h-4 mr-1" />;
    }
    return itemType === 'news' ? <Newspaper className="w-4 h-4 mr-1" /> : <BookOpen className="w-4 h-4 mr-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
          <p className="text-gray-600 mb-6">The shared content could not be found or may have been removed.</p>
          <Button 
            onClick={() => navigate('/home')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="flex items-center text-gray-600 hover:text-gray-900 bg-white shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
          <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {getIcon()}
            Shared {itemType}
          </div>
        </div>

        {/* Shared Content */}
        <Card className="bg-white shadow-xl p-8 mb-6 border-0">
          <div className="flex items-start justify-between mb-6">
            {item.category && (
              <Badge className={`${getCategoryColor(item.category)} text-sm px-3 py-1`}>
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

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {item.title}
          </h1>

          {item.description && (
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
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
              className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
            />
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {item.external_link && (
              <Button
                onClick={() => window.open(item.external_link, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                {item.type === 'PDF' ? (
                  <FileText className="w-4 h-4 mr-2" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Open {item.type || 'Link'}
              </Button>
            )}
            
            <Button
              onClick={handleOpenApp}
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50 flex items-center justify-center"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Open in NXTGEN App
            </Button>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 shadow-xl">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Discover More with NXTGEN
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Get personalized college recommendations, latest updates, scholarships, and much more!
            </p>
            <Button
              onClick={handleOpenApp}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Explore NXTGEN App
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharedContent;
