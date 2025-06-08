import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Settings, LogOut, Edit, Home as HomeIcon, Users, BookOpen, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  academic_field?: string;
  notification_preferences?: any;
  tutorial_completed: boolean;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

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

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error("Error loading profile");
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        const newProfile = {
          id: user.id,
          email: user.email || '',
          tutorial_completed: false,
          notification_preferences: {
            scholarships: true,
            admissions: true,
            events: true
          }
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          academic_field: profile.academic_field,
          notification_preferences: profile.notification_preferences
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Error updating profile");
        return;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate('/');
    }
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      notification_preferences: {
        ...profile.notification_preferences,
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Profile not found</div>
          <Button onClick={() => navigate('/home')} className="bg-blue-600 text-white hover:bg-blue-700">Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-blue-600">Profile</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-white border border-blue-200">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-blue-600 mb-1">
              {profile.email.split('@')[0]}
            </h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 mb-6 bg-white border border-blue-200">
          <h3 className="font-semibold text-blue-600 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-blue-600">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1 bg-gray-100 text-gray-800 border-blue-300"
              />
            </div>
            <div>
              <Label htmlFor="academic_field" className="text-blue-600">Academic Field</Label>
              <Input
                id="academic_field"
                value={profile.academic_field || ''}
                onChange={(e) => setProfile({ ...profile, academic_field: e.target.value })}
                placeholder="e.g., Computer Science, Engineering"
                disabled={!isEditing}
                className="mt-1 bg-gray-100 text-gray-800 border-blue-300 placeholder-gray-500"
              />
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 mb-6 bg-white border border-blue-200">
          <h3 className="font-semibold text-blue-600 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-blue-600">Scholarship Updates</Label>
                <p className="text-sm text-gray-600">Get notified about new scholarships</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.scholarships ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('scholarships', checked)}
                disabled={!isEditing}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-blue-600">Admission Updates</Label>
                <p className="text-sm text-gray-600">Get notified about admission deadlines</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.admissions ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('admissions', checked)}
                disabled={!isEditing}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-blue-600">Event Updates</Label>
                <p className="text-sm text-gray-600">Get notified about educational events</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.events ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('events', checked)}
                disabled={!isEditing}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isEditing && (
            <Button 
              onClick={updateProfile}
              disabled={saving}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/change-password')}
            variant="outline"
            className="w-full text-blue-600 border-blue-600 hover:bg-blue-100"
          >
            Change Password
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full text-blue-600 border-blue-600 hover:bg-blue-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-blue-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-blue-600"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
