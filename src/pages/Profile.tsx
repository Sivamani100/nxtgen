import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, Settings, LogOut, Edit, Home as HomeIcon, Users, BookOpen, Newspaper, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  current_education_level?: string;
  preferred_course?: string;
  preferred_branches?: string[];
  preferred_locations?: string[];
  budget_min?: number;
  budget_max?: number;
  notification_preferences?: any;
  tutorial_completed: boolean;
  profile_picture?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          full_name: null,
          phone_number: null,
          current_education_level: null,
          preferred_course: null,
          preferred_branches: [],
          preferred_locations: [],
          budget_min: null,
          budget_max: null,
          tutorial_completed: false,
          notification_preferences: {
            scholarships: true,
            admissions: true,
            events: true
          },
          profile_picture: null
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
      let profilePictureUrl = profile.profile_picture;

      if (selectedFile) {
        // Upload the file
        const fileName = `${profile.id}-${Date.now()}.${selectedFile.name.split('.').pop()}`;
        const { data, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast.error("Error uploading profile picture");
          setSaving(false);
          return;
        }

        // Get public URL
        const { publicURL, error: urlError } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(fileName);

        if (urlError) {
          console.error('Error getting public URL:', urlError);
          toast.error("Error getting profile picture URL");
          setSaving(false);
          return;
        }

        profilePictureUrl = publicURL;
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          current_education_level: profile.current_education_level,
          preferred_course: profile.preferred_course,
          preferred_branches: profile.preferred_branches,
          preferred_locations: profile.preferred_locations,
          budget_min: profile.budget_min,
          budget_max: profile.budget_max,
          notification_preferences: profile.notification_preferences,
          profile_picture: profilePictureUrl
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Error updating profile");
        return;
      }

      // Update local state
      setProfile({
        ...profile,
        profile_picture: profilePictureUrl
      });
      setSelectedFile(null);
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
      <div className="max-w-md mx-auto p-4 pb-24">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                <div className="text-white font-bold">NXTGEN</div>
              </div>
            )}
            {isEditing && (
              <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer">
                <Camera className="w-4 h-4 text-blue-500" />
              </label>
            )}
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {profile.full_name || 'User'}
          </h2>
          <p className="text-gray-600 mb-4">{profile.email}</p>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </Card>

        {/* Personal Information */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
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
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={profile.phone_number || ''}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                placeholder="Enter your phone number"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Academic Information */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Academic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current_education_level">Current Education Level</Label>
              <Input
                id="current_education_level"
                value={profile.current_education_level || ''}
                onChange={(e) => setProfile({ ...profile, current_education_level: e.target.value })}
                placeholder="e.g., 12th Grade"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="preferred_course">Preferred Course</Label>
              <Input
                id="preferred_course"
                value={profile.preferred_course || ''}
                onChange={(e) => setProfile({ ...profile, preferred_course: e.target.value })}
                placeholder="e.g., B.Tech"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="preferred_branches">Preferred Branches</Label>
              <Input
                id="preferred_branches"
                value={profile.preferred_branches ? profile.preferred_branches.join(', ') : ''}
                onChange={(e) => {
                  const branches = e.target.value.split(',').map(b => b.trim());
                  setProfile({ ...profile, preferred_branches: branches });
                }}
                placeholder="e.g., Mechanical, Civil, Electronics"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="preferred_locations">Preferred Locations</Label>
              <Input
                id="preferred_locations"
                value={profile.preferred_locations ? profile.preferred_locations.join(', ') : ''}
                onChange={(e) => {
                  const locations = e.target.value.split(',').map(l => l.trim());
                  setProfile({ ...profile, preferred_locations: locations });
                }}
                placeholder="e.g., Visakhapatnam, Hyderabad"
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget_min">Budget Min (₹)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={profile.budget_min || ''}
                  onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || null })}
                  placeholder="e.g., 200000"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="budget_max">Budget Max (₹)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={profile.budget_max || ''}
                  onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || null })}
                  placeholder="e.g., 400000"
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
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
              className="flex flex-col items-center space-y-[1px] p-1 text-green-600"
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
