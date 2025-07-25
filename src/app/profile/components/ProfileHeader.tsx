import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { MapPin, GraduationCap, Calendar, Users, MessageCircle, Edit } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    avatar: string;
    coverPhoto: string;
    bio: string;
    location: string;
    university: string;
    joinedDate: string;
    connections: number;
    posts: number;
  };
  isOwnProfile: boolean;
  onEditCover?: () => void;
}

export default function ProfileHeader({ profileData, isOwnProfile, onEditCover }: ProfileHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-lg">
      {/* Cover Photo */}
      <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${profileData.coverPhoto})` }}>
        {isOwnProfile && (
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4"
            onClick={onEditCover}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Cover
          </Button>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-card p-6 pt-16">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-card -mt-16">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{profileData.name}</h1>
            <p className="text-muted-foreground mt-1">{profileData.bio}</p>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profileData.location}
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                {profileData.university}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              {isOwnProfile ? (
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}