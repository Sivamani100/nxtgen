import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Heart, Share, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BottomNavigation } from "@/components/BottomNavigation";

interface Notification {
  id: number;
  message: string;
  category: string;
  read: boolean;
  created_at: string;
  resource_id: number | null;
  resource?: {
    title: string;
    description: string;
    external_link?: string;
    category: string;
  };
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('New notification:', payload.new);
        fetchNotifications();
        toast.success('New notification received!');
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      let query = supabase
        .from('notifications')
        .select(`
          *,
          resources (
            title,
            description,
            external_link,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (activeTab !== 'All') {
        query = query.eq('category', activeTab);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching notifications:', error);
        toast.error("Error loading notifications");
        return;
      }

      const formattedData = data?.map(notification => ({
        ...notification,
        resource: notification.resources ? {
          title: notification.resources.title,
          description: notification.resources.description,
          external_link: notification.resources.external_link,
          category: notification.resources.category
        } : undefined
      })) || [];

      setNotifications(formattedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleReadMore = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.resource?.external_link) {
      window.open(notification.resource.external_link, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate to news page to show the full article
      navigate('/news');
    }
  };

  const tabs = ['All', 'News', 'Event', 'Scholarship', 'Admission'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'News':
        return 'bg-blue-100 text-blue-700';
      case 'Event':
        return 'bg-purple-100 text-purple-700';
      case 'Scholarship':
        return 'bg-green-100 text-green-700';
      case 'Admission':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center max-w-md mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Notifications</h1>
          </div>
          
          {/* Tabs */}
          <div className="max-w-md mx-auto mt-4">
            <div className="flex overflow-x-auto space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex-shrink-0 px-3 py-2 text-xs ${
                    activeTab === tab 
                      ? 'bg-green-600 text-white' 
                      : 'text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <div className="text-gray-500 mb-2">No notifications found</div>
              <div className="text-sm text-gray-400">
                You'll see updates here when new content is added
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`overflow-hidden ${!notification.read ? 'ring-2 ring-green-200' : ''}`}>
                  {/* Notification indicator */}
                  {!notification.read && (
                    <div className="h-1 bg-green-500"></div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`px-2 py-1 rounded text-xs ${getCategoryColor(notification.category)}`}>
                        {notification.category}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {notification.resource?.title || notification.message}
                    </h3>
                    
                    {notification.resource?.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {notification.resource.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleReadMore(notification)}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read more
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

export default Notifications;
