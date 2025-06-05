
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Settings, Bell, Heart, BookOpen, LogOut, User, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileStats from "@/components/ProfileStats";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      
      // Calculate completion percentage
      const { data: completion } = await supabase
        .rpc('calculate_profile_completion', { profile_id: user.id });
      
      setCompletionPercentage(completion || 0);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>Profile not found</h2>
          <Button onClick={() => navigate('/home')} className="bg-green-600 hover:bg-green-700">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      action: () => navigate('/profile'),
      color: "text-blue-600"
    },
    {
      icon: Heart,
      label: "Favorites",
      action: () => navigate('/favorites'),
      color: "text-red-600"
    },
    {
      icon: Bell,
      label: "Notifications", 
      action: () => navigate('/notifications'),
      color: "text-yellow-600"
    },
    {
      icon: BookOpen,
      label: "Predictor",
      action: () => navigate('/predictor'),
      color: "text-green-600"
    },
    {
      icon: Settings,
      label: "Settings",
      action: () => toast.info("Settings coming soon!"),
      color: "text-gray-600"
    },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      color: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-bold text-gray-900" style={{ fontSize: '20px' }}>Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="overflow-hidden">
          <ProfileHeader 
            profile={profile}
            completionPercentage={completionPercentage}
            onEditClick={() => navigate('/profile')}
          />
        </Card>

        {/* Profile Stats */}
        <ProfileStats profile={profile} />

        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>Email</p>
                <p className="font-medium text-gray-900" style={{ fontSize: '15px' }}>{profile.email}</p>
              </div>
            </div>
            
            {profile.phone_number && (
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>Phone</p>
                  <p className="font-medium text-gray-900" style={{ fontSize: '15px' }}>{profile.phone_number}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Menu Items */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Quick Actions</h2>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={item.action}
                className="w-full justify-start p-4 h-auto hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium" style={{ fontSize: '15px' }}>{item.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Preferred Branches */}
        {profile.preferred_branches && profile.preferred_branches.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Preferred Branches</h2>
            <div className="flex flex-wrap gap-2">
              {profile.preferred_branches.map((branch: string, index: number) => (
                <span 
                  key={index} 
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium"
                  style={{ fontSize: '15px' }}
                >
                  {branch}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Preferred Locations */}
        {profile.preferred_locations && profile.preferred_locations.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontSize: '20px' }}>Preferred Locations</h2>
            <div className="flex flex-wrap gap-2">
              {profile.preferred_locations.map((location: string, index: number) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                  style={{ fontSize: '15px' }}
                >
                  {location}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* App Info */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontSize: '20px' }}>NXTGEN</h3>
          <p className="text-gray-600 mb-4" style={{ fontSize: '15px' }}>
            The Courier-Journal of Education
          </p>
          <p className="text-sm text-gray-500" style={{ fontSize: '15px' }}>
            Version 1.0.0 • Made with ❤️ for students
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
