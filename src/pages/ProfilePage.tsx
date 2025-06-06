import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats";
import { Home as HomeIcon, Users, BookOpen, Newspaper, User, Camera } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
      return null;
    }
  };

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
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      let photoUrl = profile.profile_picture_url;

      if (profilePhoto) {
        photoUrl = await uploadProfilePhoto(profilePhoto);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          profile_picture_url: photoUrl
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile();
      setIsEditing(false);
      setProfilePhoto(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <Button onClick={() => navigate('/home')} className="bg-purple-600 hover:bg-purple-700">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-purple-100">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <ProfileHeader profile={profile} />
        
        <ProfileStats profile={profile} />

        {!isEditing && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Click the "Edit Profile" button below to update your information and save changes.
            </p>
          </div>
        )}

        <Card className="p-6 bg-white shadow-xl border-2 border-purple-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2"
              >
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button 
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditing && (
              <div>
                <Label className="text-base font-semibold text-gray-900">Profile Photo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span className="text-sm">Choose Photo</span>
                    </label>
                  </div>
                  {profilePhoto && (
                    <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                      Photo selected
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label className="text-base font-semibold text-gray-900">Full Name</Label>
              <Input
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                disabled={!isEditing}
                className="text-base border-2 border-purple-200 focus:border-purple-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label className="text-base font-semibold text-gray-900">Email</Label>
              <Input
                value={profile.email || ''}
                disabled
                className="text-base bg-gray-100 border-2 border-gray-200"
              />
            </div>

            <div>
              <Label className="text-base font-semibold text-gray-900">Phone Number</Label>
              <Input
                value={profile.phone_number || ''}
                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                disabled={!isEditing}
                className="text-base border-2 border-blue-200 focus:border-blue-400"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label className="text-base font-semibold text-gray-900">Academic Field</Label>
              <Select
                value={profile.academic_field || ''}
                onValueChange={(value) => setProfile({ ...profile, academic_field: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="border-2 border-green-200 focus:border-green-400">
                  <SelectValue placeholder="Select your field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold text-gray-900">Preferred Course</Label>
              <Input
                value={profile.preferred_course || ''}
                onChange={(e) => setProfile({ ...profile, preferred_course: e.target.value })}
                disabled={!isEditing}
                className="text-base border-2 border-orange-200 focus:border-orange-400"
                placeholder="e.g., B.Tech, MBBS, B.Com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-semibold text-gray-900">Min Budget (₹)</Label>
                <Input
                  type="number"
                  value={profile.budget_min || ''}
                  onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || null })}
                  disabled={!isEditing}
                  className="text-base border-2 border-red-200 focus:border-red-400"
                  placeholder="50000"
                />
              </div>
              <div>
                <Label className="text-base font-semibold text-gray-900">Max Budget (₹)</Label>
                <Input
                  type="number"
                  value={profile.budget_max || ''}
                  onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || null })}
                  disabled={!isEditing}
                  className="text-base border-2 border-red-200 focus:border-red-400"
                  placeholder="500000"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-blue-600"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-7 h-7" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-purple-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-7 h-7" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-7 h-7" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-orange-600"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-7 h-7" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-purple-600 bg-purple-50"
            >
              <User className="w-7 h-7" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
