
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileHeaderProps {
  profile: Profile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-purple-200">
        <AvatarImage src={profile.profile_picture_url || ""} alt={profile.full_name || ""} />
        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl font-bold">
          {profile.full_name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name || "User"}</h2>
      <p className="text-gray-600">{profile.email}</p>
    </div>
  );
};
