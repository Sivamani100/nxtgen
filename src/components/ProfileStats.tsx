
import { Card } from "@/components/ui/card";
import { GraduationCap, IndianRupee, Phone } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileStatsProps {
  profile: Profile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="p-3 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <GraduationCap className="w-6 h-6 mx-auto mb-1 text-blue-600" />
        <p className="text-xs text-gray-600 mb-1">Field</p>
        <p className="text-sm font-bold text-gray-900">{profile.academic_field || "Not set"}</p>
      </Card>
      <Card className="p-3 text-center bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <IndianRupee className="w-6 h-6 mx-auto mb-1 text-green-600" />
        <p className="text-xs text-gray-600 mb-1">Budget</p>
        <p className="text-sm font-bold text-gray-900">
          {profile.budget_min && profile.budget_max 
            ? `₹${profile.budget_min/1000}K-${profile.budget_max/1000}K`
            : "Not set"
          }
        </p>
      </Card>
      <Card className="p-3 text-center bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
        <Phone className="w-6 h-6 mx-auto mb-1 text-pink-600" />
        <p className="text-xs text-gray-600 mb-1">Contact</p>
        <p className="text-sm font-bold text-gray-900">
          {profile.phone_number ? "Added" : "Not set"}
        </p>
      </Card>
    </div>
  );
};
