
import { GraduationCap, MapPin, DollarSign, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProfileStatsProps {
  profile: any;
}

const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      icon: GraduationCap,
      label: "Academic Field",
      value: profile.academic_field || "Not specified",
      color: "text-blue-600"
    },
    {
      icon: Target,
      label: "Preferred Course",
      value: profile.preferred_course || "Not specified", 
      color: "text-green-600"
    },
    {
      icon: MapPin,
      label: "Preferred Locations",
      value: profile.preferred_locations?.length ? `${profile.preferred_locations.length} locations` : "Not specified",
      color: "text-purple-600"
    },
    {
      icon: DollarSign,
      label: "Budget Range",
      value: profile.budget_min && profile.budget_max 
        ? `₹${(profile.budget_min / 100000).toFixed(1)}L - ₹${(profile.budget_max / 100000).toFixed(1)}L`
        : "Not specified",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600" style={{ fontSize: '15px' }}>{stat.label}</p>
              <p className="font-medium text-gray-900 truncate" style={{ fontSize: '15px' }}>
                {stat.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;
