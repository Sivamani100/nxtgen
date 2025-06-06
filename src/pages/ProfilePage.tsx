import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileStats } from "@/components/ProfileStats";
import { 
  Home as HomeIcon, 
  Users, 
  BookOpen, 
  Newspaper, 
  User, 
  LogOut,
  PenLine,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/BottomNavigation";

type Profile = Database['public']['Tables']['profiles']['Row'];

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [savedColleges, setSavedColleges] = useState<number>(0);
  const [branchInput, setBranchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
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
    fetchSavedColleges();
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile not found</h2>
          <Button onClick={() => navigate('/home')} className="bg-teal-600 hover:bg-teal-700">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <PenLine size={16} />
              Edit
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Check size={16} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto p-4">
          <ProfileHeader 
            profile={profile} 
            isEditing={isEditing} 
            onPhotoChange={handlePhotoChange}
            savedCollegesCount={savedColleges}
          />
          
          {!isEditing ? (
            <ProfileStats profile={profile} />
          ) : (
            <EditProfileForm 
              profile={profile} 
              setProfile={setProfile} 
              branchInput={branchInput}
              setBranchInput={setBranchInput}
              addBranch={addBranch}
              removeBranch={removeBranch}
              locationInput={locationInput}
              setLocationInput={setLocationInput}
              addLocation={addLocation}
              removeLocation={removeLocation}
            />
          )}

          {!isEditing && (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-6 flex items-center justify-center gap-2 text-red-500 border-red-100 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </Button>
          )}
        </div>
      </div>
      <BottomNavigation />
    </>
  );
};

interface EditProfileFormProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  branchInput: string;
  setBranchInput: React.Dispatch<React.SetStateAction<string>>;
  addBranch: () => void;
  removeBranch: (branch: string) => void;
  locationInput: string;
  setLocationInput: React.Dispatch<React.SetStateAction<string>>;
  addLocation: () => void;
  removeLocation: (location: string) => void;
}

const EditProfileForm = ({
  profile,
  setProfile,
  branchInput,
  setBranchInput,
  addBranch,
  removeBranch,
  locationInput,
  setLocationInput,
  addLocation,
  removeLocation
}: EditProfileFormProps) => {
  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <Card className="p-5 bg-white shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-600">Full Name</Label>
            <Input
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="border-gray-200 focus:border-teal-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label className="text-gray-600">Email</Label>
            <Input
              value={profile.email || ''}
              disabled
              className="bg-gray-50 border-gray-200"
            />
          </div>
          
          <div>
            <Label className="text-gray-600">Phone Number</Label>
            <Input
              value={profile.phone_number || ''}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
              className="border-gray-200 focus:border-teal-500"
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </Card>
      
      {/* Academic Information */}
      <Card className="p-5 bg-white shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-600">Current Education Level</Label>
            <Select
              value={profile.academic_field || ''}
              onValueChange={(value) => setProfile({ ...profile, academic_field: value })}
            >
              <SelectTrigger className="border-gray-200 focus:border-teal-500">
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
              <SelectTrigger className="border-gray-200 focus:border-teal-500">
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
      </Card>
      
      {/* Preferences */}
      <Card className="p-5 bg-white shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
        
        <div className="space-y-6">
          {/* Preferred Branches */}
          <div>
            <Label className="text-gray-600 mb-2 block">Preferred Branches</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.preferred_branches?.map((branch, idx) => (
                <Badge 
                  key={idx} 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 gap-1.5 pl-3 cursor-default"
                >
                  {branch}
                  <button 
                    onClick={() => removeBranch(branch)}
                    className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
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
                className="border-gray-200 focus:border-teal-500"
              />
              <Button 
                onClick={addBranch} 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Preferred Locations */}
          <div>
            <Label className="text-gray-600 mb-2 block">Preferred Locations</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.preferred_locations?.map((location, idx) => (
                <Badge 
                  key={idx} 
                  className="bg-green-100 text-green-800 hover:bg-green-200 gap-1.5 pl-3 cursor-default"
                >
                  {location}
                  <button 
                    onClick={() => removeLocation(location)}
                    className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
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
                className="border-gray-200 focus:border-teal-500"
              />
              <Button 
                onClick={addLocation} 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">Budget Min (₹)</Label>
              <Input
                type="number"
                value={profile.budget_min || ''}
                onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || null })}
                className="border-gray-200 focus:border-teal-500"
                placeholder="Minimum budget"
              />
            </div>
            <div>
              <Label className="text-gray-600">Budget Max (₹)</Label>
              <Input
                type="number"
                value={profile.budget_max || ''}
                onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || null })}
                className="border-gray-200 focus:border-teal-500"
                placeholder="Maximum budget"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
