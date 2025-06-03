
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Settings, LogOut, Edit } from "lucide-react";
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
        // Create profile if it doesn't exist
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-500 mb-2">Profile not found</div>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {profile.email.split('@')[0]}
            </h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1 bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="academic_field">Academic Field</Label>
              <Input
                id="academic_field"
                value={profile.academic_field || ''}
                onChange={(e) => setProfile({ ...profile, academic_field: e.target.value })}
                placeholder="e.g., Computer Science, Engineering"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Scholarship Updates</Label>
                <p className="text-sm text-gray-600">Get notified about new scholarships</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.scholarships ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('scholarships', checked)}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Admission Updates</Label>
                <p className="text-sm text-gray-600">Get notified about admission deadlines</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.admissions ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('admissions', checked)}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Event Updates</Label>
                <p className="text-sm text-gray-600">Get notified about educational events</p>
              </div>
              <Switch
                checked={profile.notification_preferences?.events ?? true}
                onCheckedChange={(checked) => updateNotificationPreference('events', checked)}
                disabled={!isEditing}
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
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/change-password')}
            variant="outline"
            className="w-full"
          >
            Change Password
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
