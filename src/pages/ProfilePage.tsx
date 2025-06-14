
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
  LogOut,
  PenLine,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4 lg:p-6 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <PenLine size={18} />
              Edit Profile
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Check size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <ProfileHeader 
              profile={profile} 
              isEditing={isEditing} 
              onPhotoChange={handlePhotoChange}
              savedCollegesCount={savedColleges}
            />
            
            {!isEditing && (
              <div className="mt-6">
                <ProfileStats profile={profile} />
              </div>
            )}

            {!isEditing && (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-6 flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut size={18} />
                Logout
              </Button>
            )}
          </div>

          {/* Right Column - Edit Form */}
          {isEditing && (
            <div className="lg:col-span-2">
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
            </div>
          )}

          {/* Full Width Stats when not editing */}
          {!isEditing && (
            <div className="lg:col-span-2">
              <Card className="p-6 bg-white shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600 text-sm">Email Address</Label>
                      <p className="text-gray-900 font-medium">{profile.email}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Phone Number</Label>
                      <p className="text-gray-900 font-medium">{profile.phone_number || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Academic Field</Label>
                      <p className="text-gray-900 font-medium">{profile.academic_field || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-600 text-sm">Preferred Course</Label>
                      <p className="text-gray-900 font-medium">{profile.preferred_course || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Budget Range</Label>
                      <p className="text-gray-900 font-medium">
                        {profile.budget_min && profile.budget_max 
                          ? `₹${(profile.budget_min / 100000).toFixed(1)}L - ₹${(profile.budget_max / 100000).toFixed(1)}L`
                          : 'Not specified'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm">Profile Completion</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${profile.profile_completion_percentage || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {profile.profile_completion_percentage || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-600 text-sm mb-2 block">Preferred Branches</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferred_branches && profile.preferred_branches.length > 0 ? (
                          profile.preferred_branches.map((branch, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800">
                              {branch}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No preferences set</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-600 text-sm mb-2 block">Preferred Locations</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferred_locations && profile.preferred_locations.length > 0 ? (
                          profile.preferred_locations.map((location, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">
                              {location}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No preferences set</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
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
