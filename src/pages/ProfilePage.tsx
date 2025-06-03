
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Save, Camera, Home as HomeIcon, Users, BookOpen, Newspaper, User, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  email: string;
  academic_field: string;
  tutorial_completed: boolean;
  notification_preferences: any;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    academic_field: '',
    preferred_course: '',
    preferred_branches: [],
    preferred_locations: [],
    budget_min: '',
    budget_max: '',
  });
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

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        name: user.user_metadata?.name || '',
        email: data.email,
        phone: user.user_metadata?.phone || '',
        academic_field: data.academic_field || '',
        preferred_course: '',
        preferred_branches: [],
        preferred_locations: [],
        budget_min: '',
        budget_max: '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          academic_field: formData.academic_field,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
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
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="p-2"
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
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {profile ? getInitials(profile.email) : 'U'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 p-2"
                disabled={!isEditing}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">{formData.name || 'User'}</h3>
            <p className="text-sm text-gray-600">{formData.email}</p>
            <div className="flex items-center justify-center mt-3">
              <div className="text-center mr-6">
                <div className="text-lg font-bold text-green-600">75%</div>
                <div className="text-xs text-gray-600">Profile Complete</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">12</div>
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Preferences</h3>
          <div className="space-y-3">
            <div>
              <Label>Preferred Branches</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Computer Science', 'Electronics', 'Mechanical', 'Civil'].map((branch) => (
                  <span key={branch} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    {branch}
                  </span>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="text-xs">
                    + Add Branch
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label>Preferred Locations</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Visakhapatnam', 'Hyderabad', 'Chennai'].map((location) => (
                  <span key={location} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                    {location}
                  </span>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="text-xs">
                    + Add Location
                  </Button>
                )}
              </div>
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
