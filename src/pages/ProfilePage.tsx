
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, User, Settings, Heart, LogOut, BookOpen, MapPin, CreditCard, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    academic_field: '',
    preferred_course: '',
    preferred_branches: [] as string[],
    preferred_locations: [] as string[],
    budget_min: '',
    budget_max: ''
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
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        academic_field: data.academic_field || '',
        preferred_course: data.preferred_course || '',
        preferred_branches: data.preferred_branches || [],
        preferred_locations: data.preferred_locations || [],
        budget_min: data.budget_min?.toString() || '',
        budget_max: data.budget_max?.toString() || ''
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

      const updateData = {
        ...formData,
        budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseInt(formData.budget_max) : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updateData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      formData.full_name,
      formData.phone_number,
      formData.academic_field,
      formData.preferred_course,
      formData.preferred_branches.length > 0,
      formData.preferred_locations.length > 0,
      formData.budget_min,
      formData.budget_max
    ];
    
    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg p-4 border-b-2 border-indigo-100">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="mr-3 hover:bg-indigo-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/favorites')}
              className="text-pink-600 hover:bg-pink-50"
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 shadow-xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {profile?.full_name || profile?.email || 'User'}
            </h2>
            <p className="text-sm text-gray-600 mb-4">{profile?.email}</p>
            
            {/* Completion Progress */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-indigo-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit/Save Button */}
        <div className="flex justify-center mb-6">
          {isEditing ? (
            <div className="flex space-x-3">
              <Button onClick={handleSave} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 shadow-lg">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                className="border-2 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 shadow-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {!isEditing && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 mb-6">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Tip:</strong> Click "Edit Profile" to update your information and preferences for better college recommendations!
            </p>
          </div>
        )}

        {/* Profile Information */}
        <div className="space-y-4">
          {/* Personal Information */}
          <Card className="p-4 bg-white shadow-lg border-2 border-blue-100">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.full_name || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.phone_number || 'Not provided'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Academic Information */}
          <Card className="p-4 bg-white shadow-lg border-2 border-green-100">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Academic Preferences</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Academic Field</Label>
                {isEditing ? (
                  <Select value={formData.academic_field} onValueChange={(value) => setFormData(prev => ({ ...prev, academic_field: value }))}>
                    <SelectTrigger className="border-2 border-green-200 focus:border-green-400">
                      <SelectValue placeholder="Select academic field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.academic_field || 'Not selected'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Preferred Course</Label>
                {isEditing ? (
                  <Input
                    value={formData.preferred_course}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_course: e.target.value }))}
                    placeholder="e.g., B.Tech, MBBS, B.Com"
                    className="border-2 border-green-200 focus:border-green-400"
                  />
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.preferred_course || 'Not specified'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Location Preferences */}
          <Card className="p-4 bg-white shadow-lg border-2 border-purple-100">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Location Preferences</h3>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700">Preferred Locations</Label>
              {isEditing ? (
                <Input
                  value={formData.preferred_locations.join(', ')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    preferred_locations: e.target.value.split(', ').filter(loc => loc.trim()) 
                  }))}
                  placeholder="e.g., Mumbai, Delhi, Bangalore"
                  className="border-2 border-purple-200 focus:border-purple-400"
                />
              ) : (
                <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                  {profile?.preferred_locations?.length > 0 ? profile.preferred_locations.join(', ') : 'Not specified'}
                </p>
              )}
            </div>
          </Card>

          {/* Budget Information */}
          <Card className="p-4 bg-white shadow-lg border-2 border-orange-100">
            <div className="flex items-center mb-3">
              <CreditCard className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">Budget Range</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Min Budget (₹)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.budget_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                    placeholder="e.g., 100000"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.budget_min ? `₹${(profile.budget_min / 100000).toFixed(1)}L` : 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Max Budget (₹)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.budget_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                    placeholder="e.g., 500000"
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                ) : (
                  <p className="text-base text-gray-900 bg-gray-50 p-2 rounded border">
                    {profile?.budget_max ? `₹${(profile.budget_max / 100000).toFixed(1)}L` : 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Saved Colleges</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-2 border-green-200 hover:border-green-400 hover:bg-green-50"
              onClick={() => navigate('/predictor')}
            >
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Rank Predictor</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
