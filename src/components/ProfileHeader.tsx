
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Database } from "@/integrations/supabase/types";
import { Camera } from "lucide-react";

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileHeaderProps {
  profile: Profile;
  isEditing: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  savedCollegesCount?: number;
}

export const ProfileHeader = ({ profile, isEditing, onPhotoChange, savedCollegesCount = 0 }: ProfileHeaderProps) => {
  const completionPercentage = profile.profile_completion_percentage || 0;
  
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-sm mb-4 border border-gray-100">
      <div className="relative w-24 h-24 mx-auto mb-3">
        <Avatar className="w-24 h-24 border-4 border-gray-100">
          <AvatarImage src={profile.profile_picture_url || ""} alt={profile.full_name || ""} />
          <AvatarFallback className="bg-gradient-to-br from-teal-400 to-teal-500 text-white text-2xl font-bold">
            {profile.full_name?.charAt(0) || "N"}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="absolute bottom-0 right-0">
            <input
              type="file"
              accept="image/*"
              onChange={onPhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-teal-500" />
            </label>
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.full_name || "User"}</h2>
      <p className="text-gray-600 text-sm mb-4">{profile.email}</p>
      
      <div className="flex justify-center items-center space-x-10">
        <div className="text-center">
          <p className="text-xl font-bold text-teal-500">{completionPercentage}%</p>
          <p className="text-xs text-gray-500">Profile Complete</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-500">{savedCollegesCount}</p>
          <p className="text-xs text-gray-500">Saved Colleges</p>
        </div>
      </div>
    </div>
  );
};
