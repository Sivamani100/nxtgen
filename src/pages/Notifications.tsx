
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Heart, Share, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: number;
  message: string;
  category: string;
  read: boolean;
  created_at: string;
  resource_id: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('New notification:', payload.new);
        fetchNotifications();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      let query = supabase
        .from('notifications')
        .select('*')
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

      setNotifications(data || []);
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

  const tabs = ['All', 'Scholarships', 'Admissions', 'Events'];

  // Mock notifications if none exist
  const mockNotifications = [
    {
      id: 1,
      message: "New Government Scholarship for Engineering Students - Applications open for merit-based scholarships worth $5000 per semester",
      category: "Scholarships",
      read: false,
      created_at: "2025-05-22T10:00:00Z",
      resource_id: 1
    },
    {
      id: 2,
      message: "EAMCET 2025 Counseling schedule - The counseling for EAMCET 2025 admission will begin from June 19, 2025",
      category: "Admissions",
      read: false,
      created_at: "2025-05-24T09:00:00Z",
      resource_id: 2
    },
    {
      id: 3,
      message: "Virtual College Fair on June 5-6, 2025 - Over 100 colleges from across the country will participate",
      category: "Events",
      read: true,
      created_at: "2025-05-20T14:00:00Z",
      resource_id: 3
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center max-w-md mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Colleges News & Updates</h1>
        </div>
        <div className="max-w-md mx-auto mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Bell className="w-4 h-4 text-gray-400" />
            </div>
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto flex overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={`flex-shrink-0 px-4 py-3 border-b-2 ${
                activeTab === tab 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => {
                setActiveTab(tab);
                fetchNotifications();
              }}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayNotifications.map((notification) => (
              <Card key={notification.id} className="overflow-hidden">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-400 relative">
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Bell className="w-12 h-12 mx-auto mb-2" />
                      <div className="text-sm font-medium">Educational Update</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {notification.message.split(' - ')[0]}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span>{new Date(notification.created_at).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="text-green-600">{notification.category}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {notification.message.split(' - ')[1] || notification.message}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Read more
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>
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

export default Notifications;
