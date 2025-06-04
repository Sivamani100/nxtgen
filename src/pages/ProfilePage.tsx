
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, Camera, Home as HomeIcon, Users, BookOpen, Newspaper, User, LogOut, X } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  academic_field: string | null;
  preferred_course: string | null;
  preferred_branches: string[] | null;
  preferred_locations: string[] | null;
  budget_min: number | null;
  budget_max: number | null;
  profile_picture_url: string | null;
  profile_completion_percentage: number | null;
  tutorial_completed: boolean | null;
  notification_preferences: any;
  created_at: string | null;
}

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
  'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar',
  'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Madurai', 'Gurgaon', 'Navi Mumbai', 'Aurangabad', 'Solapur',
  'Ranchi', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
  'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida',
  'Jamshedpur', 'Bhilai Nagar', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar',
  'Dehradun', 'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola',
  'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu',
  'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli',
  'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala'
];

const ENGINEERING_BRANCHES = [
  'Computer Science Engineering', 'Information Technology', 'Electronics and Communication Engineering',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Aerospace Engineering', 'Automobile Engineering', 'Biotechnology Engineering',
  'Environmental Engineering', 'Industrial Engineering', 'Materials Engineering',
  'Mining Engineering', 'Nuclear Engineering', 'Petroleum Engineering', 'Software Engineering',
  'Biomedical Engineering', 'Agricultural Engineering', 'Food Technology',
  'Textile Engineering', 'Marine Engineering', 'Metallurgical Engineering',
  'Production Engineering', 'Robotics Engineering', 'Data Science and Engineering',
  'Artificial Intelligence and Machine Learning', 'Cyber Security', 'Electronics and Instrumentation',
  'Information Science Engineering', 'Telecommunication Engineering'
];

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedCollegesCount, setSavedCollegesCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    academic_field: '',
    preferred_course: '',
    preferred_branches: [] as string[],
    preferred_locations: [] as string[],
    budget_min: '',
    budget_max: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchSavedCollegesCount();
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
      
      // Handle the data properly with null checks
      const profileData: Profile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || null,
        phone_number: data.phone_number || null,
        academic_field: data.academic_field || null,
        preferred_course: data.preferred_course || null,
        preferred_branches: data.preferred_branches || null,
        preferred_locations: data.preferred_locations || null,
        budget_min: data.budget_min || null,
        budget_max: data.budget_max || null,
        profile_picture_url: data.profile_picture_url || null,
        profile_completion_percentage: data.profile_completion_percentage || null,
        tutorial_completed: data.tutorial_completed || null,
        notification_preferences: data.notification_preferences,
        created_at: data.created_at || null
      };
      
      setProfile(profileData);
      setFormData({
        full_name: profileData.full_name || '',
        email: profileData.email,
        phone_number: profileData.phone_number || '',
        academic_field: profileData.academic_field || '',
        preferred_course: profileData.preferred_course || '',
        preferred_branches: profileData.preferred_branches || [],
        preferred_locations: profileData.preferred_locations || [],
        budget_min: profileData.budget_min?.toString() || '',
        budget_max: profileData.budget_max?.toString() || '',
      });
      
      // Calculate and update profile completion
      await updateProfileCompletion(user.id);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedCollegesCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('user_college_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedCollegesCount(count || 0);
    } catch (error) {
      console.error('Error fetching saved colleges count:', error);
    }
  };

  const updateProfileCompletion = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_profile_completion', { profile_id: userId });

      if (error) throw error;

      await supabase
        .from('profiles')
        .update({ profile_completion_percentage: data })
        .eq('id', userId);

      setProfile(prev => prev ? { ...prev, profile_completion_percentage: data } : null);
    } catch (error) {
      console.error('Error updating profile completion:', error);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          academic_field: formData.academic_field,
          preferred_course: formData.preferred_course,
          preferred_branches: formData.preferred_branches,
          preferred_locations: formData.preferred_locations,
          budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
          budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchProfile();
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const addPreferredBranch = (branch: string) => {
    if (!formData.preferred_branches.includes(branch)) {
      setFormData(prev => ({
        ...prev,
        preferred_branches: [...prev.preferred_branches, branch]
      }));
    }
  };

  const removePreferredBranch = (branch: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_branches: prev.preferred_branches.filter(b => b !== branch)
    }));
  };

  const addPreferredLocation = (location: string) => {
    if (!formData.preferred_locations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, location]
      }));
    }
  };

  const removePreferredLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(l => l !== location)
    }));
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-lg font-semibold">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(!isEditing)}
            className="p-2"
            disabled={uploading}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {getInitials(formData.full_name || profile?.email || 'User')}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-picture"
                disabled={uploading}
              />
              <label htmlFor="profile-picture">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 p-2 cursor-pointer"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    <Camera className="w-4 h-4" />
                  </span>
                </Button>
              </label>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">{formData.full_name || 'User'}</h3>
            <p className="text-sm text-gray-600">{formData.email}</p>
            <div className="flex items-center justify-center mt-3 space-x-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{profile?.profile_completion_percentage || 0}%</div>
                <div className="text-xs text-gray-600">Profile Complete</div>
              </div>
              <div 
                className="text-center cursor-pointer"
                onClick={() => navigate('/favorites')}
              >
                <div className="text-lg font-bold text-blue-600">{savedCollegesCount}</div>
                <div className="text-xs text-gray-600">Saved Colleges</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </Card>

        {/* Academic Information */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Academic Information</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="academic_field">Current Education Level</Label>
              <Select 
                value={formData.academic_field} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, academic_field: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12th">12th Grade</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferred_course">Preferred Course</Label>
              <Select 
                value={formData.preferred_course} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_course: value }))}
                disabled={!isEditing}
              >
                <SelectTrigger className={!isEditing ? 'bg-gray-50' : ''}>
                  <SelectValue placeholder="Select preferred course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btech">B.Tech</SelectItem>
                  <SelectItem value="mbbs">MBBS</SelectItem>
                  <SelectItem value="bds">BDS</SelectItem>
                  <SelectItem value="bsc">B.Sc</SelectItem>
                  <SelectItem value="bcom">B.Com</SelectItem>
                  <SelectItem value="bba">BBA</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="mba">MBA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Preferences</h3>
          <div className="space-y-4">
            <div>
              <Label>Preferred Branches</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {formData.preferred_branches.map((branch) => (
                  <span key={branch} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                    {branch}
                    {isEditing && (
                      <button 
                        onClick={() => removePreferredBranch(branch)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <Select onValueChange={addPreferredBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_BRANCHES.filter(branch => !formData.preferred_branches.includes(branch)).map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div>
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {formData.preferred_locations.map((location) => (
                  <span key={location} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center">
                    {location}
                    {isEditing && (
                      <button 
                        onClick={() => removePreferredLocation(location)}
                        className="ml-1 text-green-500 hover:text-green-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <Select onValueChange={addPreferredLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add location" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_CITIES.filter(city => !formData.preferred_locations.includes(city)).map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="budget_min">Budget Min (₹)</Label>
                <Input
                  id="budget_min"
                  value={formData.budget_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="50,000"
                  type="number"
                />
              </div>
              <div>
                <Label htmlFor="budget_max">Budget Max (₹)</Label>
                <Input
                  id="budget_max"
                  value={formData.budget_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50' : ''}
                  placeholder="2,00,000"
                  type="number"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex space-x-3 mb-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        )}

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/home')}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/colleges')}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-gray-400"
              onClick={() => navigate('/news')}
            >
              <Newspaper className="w-5 h-5" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 p-2 text-green-600"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
