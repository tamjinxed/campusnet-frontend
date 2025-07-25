'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface Activity {
  id: number;
  type: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: string;
}

interface ProfileActivityProps {
  activities: Activity[];
  profileData: {
    name: string;
    avatar: string;
  };
}

export default function ProfileActivity({ activities, profileData }: ProfileActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Activities
          <Badge variant="secondary">{activities.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback>
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{profileData.name}</span>
                  <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm mb-3">{activity.content}</p>
                
                {activity.images && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {activity.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}
                
                {activity.type === "post" && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {activity.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      {activity.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="ml-auto">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}