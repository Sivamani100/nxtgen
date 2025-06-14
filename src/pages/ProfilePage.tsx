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
            : data.notification_preferences // ensure correct shape for TS (fix bug)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-16 lg:pb-0">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
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

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <User className="w-8 h-8 text-green-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              </div>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={updateProfile} disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-4 lg:p-6 bg-white shadow-lg">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                    {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                  {profile.full_name || 'Complete Your Profile'}
                </h2>
                <p className="text-sm lg:text-base text-gray-600 mb-4">{profile.email}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs lg:text-sm text-gray-600 mb-1">
                    <span>Profile Completion</span>
                    <span>{profile.profile_completion_percentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile.profile_completion_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-4 lg:p-6 bg-white shadow-lg">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Full Name</Label>
                      {editing ? (
                        <Input
                          value={profile.full_name || ''}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          {profile.full_name || 'Not provided'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Email</Label>
                      <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                        {profile.email}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Phone Number</Label>
                      {editing ? (
                        <Input
                          value={profile.phone_number || ''}
                          onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          {profile.phone_number || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Academic Field</Label>
                      {editing ? (
                        <Select 
                          value={profile.academic_field || ''} 
                          onValueChange={(value) => setProfile({ ...profile, academic_field: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select academic field" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicFields.map((field) => (
                              <SelectItem key={field} value={field}>{field}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          {profile.academic_field || 'Not selected'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Preferred Course</Label>
                      {editing ? (
                        <Select 
                          value={profile.preferred_course || ''} 
                          onValueChange={(value) => setProfile({ ...profile, preferred_course: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select preferred course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course} value={course}>{course}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          {profile.preferred_course || 'Not selected'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Budget Information */}
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                    Budget Range
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Minimum Budget (₹)</Label>
                      {editing ? (
                        <Input
                          type="number"
                          value={profile.budget_min || ''}
                          onChange={(e) => setProfile({ ...profile, budget_min: parseInt(e.target.value) || 0 })}
                          placeholder="Enter minimum budget"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          ₹{profile.budget_min?.toLocaleString() || 'Not set'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Maximum Budget (₹)</Label>
                      {editing ? (
                        <Input
                          type="number"
                          value={profile.budget_max || ''}
                          onChange={(e) => setProfile({ ...profile, budget_max: parseInt(e.target.value) || 0 })}
                          placeholder="Enter maximum budget"
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm lg:text-base text-gray-700 bg-gray-50 p-3 rounded">
                          ₹{profile.budget_max?.toLocaleString() || 'Not set'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
