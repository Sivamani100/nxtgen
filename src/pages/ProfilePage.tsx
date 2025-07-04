import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Bell,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  LogOut
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  academic_field: string;
  preferred_course: string;
  preferred_branches: string[];
  preferred_locations: string[];
  budget_min: number;
  budget_max: number;
  profile_picture_url: string;
  profile_completion_percentage: number;
  notification_preferences: {
    events: boolean;
    admissions: boolean;
    scholarships: boolean;
  };
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const academicFields = [
    'Engineering',
    'Medical',
    'Management',
    'Arts',
    'Science',
    'Commerce',
    'Law',
    'Other'
  ];

  const courses = [
    'B.Tech',
    'B.E',
    'MBBS',
    'BDS',
    'MBA',
    'MCA',
    'B.Sc',
    'B.Com',
    'BA',
    'LLB',
    'Other'
  ];

  const branches = [
    'Computer Science Engineering',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology',
    'Aerospace Engineering',
    'Automobile Engineering'
  ];

  const locations = [
    'Andhra Pradesh',
    'Telangana',
    'Karnataka',
    'Tamil Nadu',
    'Kerala',
    'Maharashtra',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Other'
  ];

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
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          ...data,
          notification_preferences: typeof data.notification_preferences === "string"
            ? JSON.parse(data.notification_preferences)
            : data.notification_preferences
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
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
        .update(profile)
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader onEditToggle={handleEditToggle} />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-3">
                <User className="w-8 h-8 text-green-600 mr-3" />
                <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
              </div>
              <p className="text-lg text-gray-600">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              {editing ? (
                <>
                  <Button variant="outline" size="lg" onClick={() => setEditing(false)}>
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </Button>
                  <Button size="lg" onClick={updateProfile} disabled={saving}>
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => setEditing(true)}>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Edit Controls */}
      <div className="lg:hidden bg-white shadow-sm border-b mt-16">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <User className="w-6 h-6 text-green-600 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            {editing ? (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={updateProfile} disabled={saving}>
                  <Save className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Layout */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Left Sidebar/Profile Summary (1 column) */}
        <div className="lg:col-span-1 mb-6 lg:mb-0">
          <Card className="p-6 bg-white shadow-lg flex flex-col items-center">
            <div className="text-center w-full">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl lg:text-4xl font-bold shadow-lg">
                  {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                {editing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50">
                    <Camera className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {profile.full_name || 'Complete Your Profile'}
              </h2>
              <p className="text-gray-600 mb-6">{profile.email}</p>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Profile Completion</span>
                  <span>{profile.profile_completion_percentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${profile.profile_completion_percentage || 0}%` }}
                  ></div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content (3 columns, 4-row grid) */}
        <div className="lg:col-span-3 grid grid-rows-4 gap-6">
          {/* Personal Information (Row 1) */}
          <Card className="p-6 lg:p-8 bg-white shadow-lg">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Personal Information
              </h3>
              <p className="text-gray-600">Update your personal details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Full Name</Label>
                {editing ? (
                  <Input
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">{profile.full_name || 'Not provided'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Email</Label>
                <div className="h-12 bg-gray-100 border border-gray-200 rounded-md px-4 flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700">{profile.email}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Phone Number</Label>
                {editing ? (
                  <Input
                    value={profile.phone_number || ''}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    placeholder="Enter your phone number"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{profile.phone_number || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Academic Information (Row 2) */}
          <Card className="p-6 lg:p-8 bg-white shadow-lg">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-green-600" />
                Academic Information
              </h3>
              <p className="text-gray-600">Your educational preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Academic Field</Label>
                {editing ? (
                  <Select 
                    value={profile.academic_field || ''} 
                    onValueChange={(value) => setProfile({ ...profile, academic_field: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select academic field" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicFields.map((field) => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">{profile.academic_field || 'Not selected'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Preferred Course</Label>
                {editing ? (
                  <Select 
                    value={profile.preferred_course || ''} 
                    onValueChange={(value) => setProfile({ ...profile, preferred_course: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select preferred course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">{profile.preferred_course || 'Not selected'}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Budget Information (Row 3) */}
          <Card className="p-6 lg:p-8 bg-white shadow-lg">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <DollarSign className="w-6 h-6 mr-3 text-purple-600" />
                Budget Range
              </h3>
              <p className="text-gray-600">Set your budget preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Minimum Budget (₹)</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={profile.budget_min || ''}
                    onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || 0 })}
                    placeholder="Enter minimum budget"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">
                      {profile.budget_min ? `₹${profile.budget_min.toLocaleString()}` : 'Not set'}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Maximum Budget (₹)</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={profile.budget_max || ''}
                    onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || 0 })}
                    placeholder="Enter maximum budget"
                    className="h-12"
                  />
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">
                      {profile.budget_max ? `₹${profile.budget_max.toLocaleString()}` : 'Not set'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Preferences (Row 4) - Adding Preferred Branches and Locations */}
          <Card className="p-6 lg:p-8 bg-white shadow-lg">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-teal-600" />
                Preferences
              </h3>
              <p className="text-gray-600">Set your preferred branches and locations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Preferred Branches</Label>
                {editing ? (
                  <Select 
                    value={profile.preferred_branches?.[0] || ''} 
                    onValueChange={(value) => setProfile({ ...profile, preferred_branches: [value] })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select preferred branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">{profile.preferred_branches?.join(', ') || 'None'}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">Preferred Locations</Label>
                {editing ? (
                  <Select 
                    value={profile.preferred_locations?.[0] || ''} 
                    onValueChange={(value) => setProfile({ ...profile, preferred_locations: [value] })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select preferred location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-12 bg-gray-50 border border-gray-200 rounded-md px-4 flex items-center">
                    <span className="text-gray-900">{profile.preferred_locations?.join(', ') || 'None'}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-evenly gap-2 py-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/home')}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/colleges')}
            >
              <MapPin className="w-6 h-6" />
              <span className="text-xs">Colleges</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/predictor')}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-xs">Predictor</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-gray-600 hover:text-green-600"
              onClick={() => navigate('/news')}
            >
              <Bell className="w-6 h-6" />
              <span className="text-xs">News</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-[1px] p-1 text-green-600 bg-green-50 rounded-full"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
