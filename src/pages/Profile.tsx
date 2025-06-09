import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Settings, LogOut, Edit, Home as HomeIcon, Users, BookOpen, Newspaper, PenLine, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [savedColleges, setSavedColleges] = useState<number>(0);
  const [branchInput, setBranchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchSavedColleges();
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

  const fetchSavedColleges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('user_college_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedColleges(count || 0);
    } catch (error) {
      console.error('Error fetching saved colleges count:', error);
    }
  };

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

  const updateProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      let photoUrl = profile.profile_picture_url;

      if (profilePhoto) {
        photoUrl = await uploadProfilePhoto(profilePhoto);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          academic_field: profile.academic_field,
          notification_preferences: profile.notification_preferences,
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          preferred_course: profile.preferred_course,
          preferred_branches: profile.preferred_branches,
          preferred_locations: profile.preferred_locations,
          budget_min: profile.budget_min,
          budget_max: profile.budget_max,
          profile_picture_url: photoUrl
        })
        .eq('id', profile.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Error updating profile");
        return;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      setProfilePhoto(null);
      await fetchProfile();
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
      navigate('/login');
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

  const addBranch = () => {
    if (!branchInput.trim() || !profile) return;
    
    const branches = profile.preferred_branches || [];
    if (!branches.includes(branchInput.trim())) {
      setProfile({
        ...profile,
        preferred_branches: [...branches, branchInput.trim()]
      });
    }
    setBranchInput("");
  };

  const removeBranch = (branch: string) => {
    if (!profile || !profile.preferred_branches) return;
    
    setProfile({
      ...profile,
      preferred_branches: profile.preferred_branches.filter(b => b !== branch)
    });
  };

  const addLocation = () => {
    if (!locationInput.trim() || !profile) return;
    
    const locations = profile.preferred_locations || [];
    if (!locations.includes(locationInput.trim())) {
      setProfile({
        ...profile,
        preferred_locations: [...locations, locationInput.trim()]
      });
    }
    setLocationInput("");
  };

  const removeLocation = (location: string) => {
    if (!profile || !profile.preferred_locations) return;
    
    setProfile({
      ...profile,
      preferred_locations: profile.preferred_locations.filter(l => l !== location)
    });
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.email,
      profile.phone_number,
      profile.academic_field,
      profile.preferred_course,
      profile.preferred_branches?.length,
      profile.preferred_locations?.length,
      profile.budget_min,
      profile.budget_max,
      profile.profile_picture_url
    ];
    const filledFields = fields.filter(field => field != null && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-gray-600 mb-2">Profile not found</div>
          <Button onClick={() => navigate('/home')} className="bg-teal-500 text-white hover:bg-teal-600 rounded-full">Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-1"
          >
            <PenLine size={16} />
            Edit
          </Button>
        ) : (
          <Button 
            onClick={updateProfile}
            disabled={saving}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-1"
          >
            <Check size={16} />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Profile Header */}
        <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {profile.profile_picture_url ? (
                <img src={profile.profile_picture_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                profile.full_name ? profile.full_name[0] : profile.email[0]
              )}
            </div>
            {isEditing && (
              <div className="mb-4">
                <Label htmlFor="profilePhoto" className="text-gray-600">Change Profile Photo</Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 bg-gray-100 text-gray-800 border-gray-300"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {profile.full_name || profile.email.split('@')[0]}
            </h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-lg font-semibold text-teal-500">{calculateProfileCompletion()}%</p>
                <p className="text-sm text-gray-500">Profile Complete</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-teal-500">{savedColleges}</p>
                <p className="text-sm text-gray-500">Saved Colleges</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Full Name</Label>
                <Input
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="border-gray-200 focus:border-teal-500 rounded-md"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <Input
                  value={profile.email || ''}
                  disabled
                  className="bg-gray-100 border-gray-200 rounded-md"
                />
              </div>
              <div>
                <Label className="text-gray-600">Phone Number</Label>
                <Input
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  className="border-gray-200 focus:border-teal-500 rounded-md"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600 font-medium">Full Name</Label>
                <p className="text-gray-800">{profile.full_name || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Email</Label>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Phone Number</Label>
                <p className="text-gray-800">{profile.phone_number || 'Not set'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Academic Information */}
        <Card className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">Current Education Level</Label>
                <Select
                  value={profile.academic_field || ''}
                  onValueChange={(value) => setProfile({ ...profile, academic_field: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-teal-500 rounded-md">
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12th Grade">12th Grade</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-600">Preferred Course</Label>
                <Select
                  value={profile.preferred_course || ''}
                  onValueChange={(value) => setProfile({ ...profile, preferred_course: value })}
                >
                  <SelectTrigger className="border-gray-200 focus:border-teal-500 rounded-md">
                    <SelectValue placeholder="Select your preferred course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Tech">B.Tech</SelectItem>
                    <SelectItem value="MBBS">MBBS</SelectItem>
                    <SelectItem value="B.Com">B.Com</SelectItem>
                    <SelectItem value="BBA">BBA</SelectItem>
                    <SelectItem value="B.Sc">B.Sc</SelectItem>
                    <SelectItem value="B.A">B.A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600 font-medium">Current Education Level</Label>
                <p className="text-gray-800">{profile.academic_field || 'Not set'}</p>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Preferred Course</Label>
                <p className="text-gray-800">{profile.preferred_course || 'Not set'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Preferences */}
        <Card className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <Label className="text-gray-600 mb-2 block">Preferred Branches</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.preferred_branches?.map((branch, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-teal-100 text-teal-800 hover:bg-teal-200 gap-1.5 pl-3 cursor-default rounded-full"
                    >
                      {branch}
                      <button 
                        onClick={() => removeBranch(branch)}
                        className="ml-1 text-teal-600 hover:text-teal-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    placeholder="Add branch"
                    className="border-gray-200 focus:border-teal-500 rounded-md"
                  />
                  <Button 
                    onClick={addBranch} 
                    size="sm" 
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Preferred Locations</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.preferred_locations?.map((location, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-teal-100 text-teal-800 hover:bg-teal-200 gap-1.5 pl-3 cursor-default rounded-full"
                    >
                      {location}
                      <button 
                        onClick={() => removeLocation(location)}
                        className="ml-1 text-teal-600 hover:text-teal-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Add location"
                    className="border-gray-200 focus:border-teal-500 rounded-md"
                  />
                  <Button 
                    onClick={addLocation} 
                    size="sm" 
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-md"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Budget Min (₹)</Label>
                  <Input
                    type="number"
                    value={profile.budget_min || ''}
                    onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || null })}
                    className="border-gray-200 focus:border-teal-500 rounded-md"
                    placeholder="Minimum budget"
                  />
                </div>
                <div>
                  <Label className="text-gray-600">Budget Max (₹)</Label>
                  <Input
                    type="number"
                    value={profile.budget_max || ''}
                    onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || null })}
                    className="border-gray-200 focus:border-teal-500 rounded-md"
                    placeholder="Maximum budget"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600 font-medium">Preferred Branches</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_branches?.length ? (
                    profile.preferred_branches.map((branch, idx) => (
                      <Badge key={idx} className="bg-teal-100 text-teal-800 rounded-full">{branch}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-800">None</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Preferred Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_locations?.length ? (
                    profile.preferred_locations.map((location, idx) => (
                      <Badge key={idx} className="bg-teal-100 text-teal-800 rounded-full">{location}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-800">None</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 font-medium">Budget Min (₹)</Label>
                  <p className="text-gray-800">{profile.budget_min || 'Not set'}</p>
                </div>
                <div>
                  <Label className="text-gray-600 font-medium">Budget Max (₹)</Label>
                  <p className="text-gray-800">{profile.budget_max || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-600">Scholarship Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about new scholarships</p>
                </div>
                <Switch
                  checked={profile.notification_preferences?.scholarships ?? true}
                  onCheckedChange={(checked) => updateNotificationPreference('scholarships', checked)}
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-600">Admission Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about admission deadlines</p>
                </div>
                <Switch
                  checked={profile.notification_preferences?.admissions ?? true}
                  onCheckedChange={(checked) => updateNotificationPreference('admissions', checked)}
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-600">Event Updates</Label>
                  <p className="text-sm text-gray-500">Get notified about educational events</p>
                </div>
                <Switch
                  checked={profile.notification_preferences?.events ?? true}
                  onCheckedChange={(checked) => updateNotificationPreference('events', checked)}
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600 font-medium">Scholarship Updates</Label>
                <p className="text-gray-800">{profile.notification_preferences?.scholarships ? 'On' : 'Off'}</p>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Admission Updates</Label>
                <p className="text-gray-800">{profile.notification_preferences?.admissions ? 'On' : 'Off'}</p>
              </div>
              <div>
                <Label className="text-gray-600 font-medium">Event Updates</Label>
                <p className="text-gray-800">{profile.notification_preferences?.events ? 'On' : 'Off'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="space-y-3 mt-6">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full text-red-500 border-gray-300 hover:bg-gray-100 rounded-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-teal-600"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-teal-600"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-teal-600"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-teal-600"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-teal-600 bg-teal-50 rounded-full"
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
