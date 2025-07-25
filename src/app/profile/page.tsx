'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { CreatePostModal }  from '@/app/components/modals/CreatePostModal';
import ProfileHeader from './components/ProfileHeader';
import ProfileActivity from './components/ProfileActivity';
import { 
  Edit,
  Plus,
  GraduationCap,
  Award
} from 'lucide-react';

export default function ProfilePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const profileData = {
    name: "Alex Johnson",
    avatar: `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face`,
    coverPhoto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=300&fit=crop",
    bio: "Computer Science student passionate about web development and AI.",
    location: "San Francisco, CA",
    university: "Stanford University",
    year: "Senior",
    major: "Computer Science",
    connections: 342,
    posts: 28,
    joinedDate: "March 2022"
  };

  // ... (keep your existing activity/education data)

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        <ProfileHeader 
          profileData={profileData} 
          isOwnProfile={true} 
          onEditCover={() => console.log('Edit cover')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Creation Card */}
            <Card>
              <CardContent className="p-4">
                <div 
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setIsPostModalOpen(true)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-muted-foreground">
                    What's on your mind, {profileData.name.split(' ')[0]}?
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProfileActivity activities={activities} profileData={profileData} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <EducationSection education={education} />
            <InterestsSection interests={interests} />
          </div>
        </div>
      </div>

      <CreatePostModal 
        open={isPostModalOpen} 
        onOpenChange={setIsPostModalOpen} 
      />
    </div>
  );
}

// Extracted Education Component
const EducationSection = ({ education }: { education: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        Education
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{edu.institution}</h4>
            <p className="text-sm text-muted-foreground">{edu.degree}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Extracted Interests Component
const InterestsSection = ({ interests }: { interests: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        Interests
        <Button variant="ghost" size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-3">
        {interests.map((interest, index) => (
          <div key={index} className="group cursor-pointer">
            <img
              src={interest.image}
              alt={interest.name}
              className="w-full h-20 object-cover rounded-lg"
            />
            <p className="text-xs text-center font-medium mt-1">{interest.name}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);