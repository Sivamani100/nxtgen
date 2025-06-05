
import { Camera, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: any;
  completionPercentage: number;
  onEditClick: () => void;
}

const ProfileHeader = ({ profile, completionPercentage, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-t-lg text-white">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {profile.profile_picture_url ? (
            <img 
              src={profile.profile_picture_url} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center">
              <Camera className="w-8 h-8 text-white/60" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
            <Edit3 className="w-4 h-4 text-green-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-xl font-bold" style={{ fontSize: '20px' }}>
            {profile.full_name || 'Complete Your Profile'}
          </h1>
          <p className="text-white/80" style={{ fontSize: '15px' }}>
            {profile.email}
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-white/80" style={{ fontSize: '15px' }}>Profile Completion</span>
              <span className="text-sm font-medium" style={{ fontSize: '15px' }}>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onEditClick}
          className="bg-white/20 hover:bg-white/30 border-white/30"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          <span style={{ fontSize: '15px' }}>Edit</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
