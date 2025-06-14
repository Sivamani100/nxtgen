
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar,
  BookOpen,
  CheckCheck
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  message: string;
  category: string;
  read: boolean;
  created_at: string;
  resource_id?: number;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
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

      if (error) throw error;

      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      admissions: 'bg-blue-100 text-blue-800',
      exams: 'bg-green-100 text-green-800',
      scholarships: 'bg-purple-100 text-purple-800',
      events: 'bg-orange-100 text-orange-800',
      announcements: 'bg-red-100 text-red-800',
      news: 'bg-indigo-100 text-indigo-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark All
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with the latest announcements</p>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <CheckCheck className="w-5 h-5 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-sm lg:text-base text-gray-600">
              We'll notify you when there are important updates
            </p>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 lg:p-5 transition-all duration-200 ${
                  notification.read 
                    ? 'bg-white border-gray-200' 
                    : 'bg-blue-50 border-blue-200 shadow-md'
                } hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getCategoryColor(notification.category)} text-xs font-medium`}>
                        {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>

                    {/* Message */}
                    <p className={`text-sm lg:text-base mb-2 ${
                      notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'
                    }`}>
                      {notification.message}
                    </p>

                    {/* Timestamp */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                      {new Date(notification.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteNotification(notification.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
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
