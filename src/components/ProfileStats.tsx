
import { Database } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileStatsProps {
  profile: Profile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  // Show only fields that have values
  const showPersonalInfo = profile.full_name || profile.email || profile.phone_number;
  const showAcademicInfo = profile.academic_field || profile.preferred_course;
  const showPreferenceInfo = 
    (profile.preferred_branches && profile.preferred_branches.length > 0) || 
    (profile.preferred_locations && profile.preferred_locations.length > 0) ||
    profile.budget_min || profile.budget_max;

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      {showPersonalInfo && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          
          {profile.full_name && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="text-gray-800">{profile.full_name}</p>
            </div>
          )}
          
          {profile.email && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-gray-800">{profile.email}</p>
            </div>
          )}
          
          {profile.phone_number && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <p className="text-gray-800">{profile.phone_number}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Academic Information */}
      {showAcademicInfo && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
          
          {profile.academic_field && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Current Education Level</p>
              <p className="text-gray-800">{profile.academic_field}</p>
            </div>
          )}
          
          {profile.preferred_course && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Preferred Course</p>
              <p className="text-gray-800">{profile.preferred_course}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Preferences */}
      {showPreferenceInfo && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          
          {profile.preferred_branches && profile.preferred_branches.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Preferred Branches</p>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_branches.map((branch, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                    {branch}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {profile.preferred_locations && profile.preferred_locations.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Preferred Locations</p>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_locations.map((location, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {(profile.budget_min || profile.budget_max) && (
            <div className="grid grid-cols-2 gap-4">
              {profile.budget_min && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget Min (₹)</p>
                  <p className="text-gray-800">{profile.budget_min}</p>
                </div>
              )}
              {profile.budget_max && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Budget Max (₹)</p>
                  <p className="text-gray-800">{profile.budget_max}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
