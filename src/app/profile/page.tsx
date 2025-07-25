'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { CreatePostModal } from '@/app/components/modals/CreatePostModal';
import ProfileHeader from './components/ProfileHeader';
import ProfileActivity from './components/ProfileActivity';
import { Edit, Plus, GraduationCap, Award } from 'lucide-react';

export default function ProfilePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Profile data
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

  // Activities data
  const activities = [
    {
      id: 1,
      type: 'post',
      content: 'Just finished my final project!',
      date: '2 hours ago',
      likes: 24,
      comments: 5,
      user: {
        name: 'Alex Johnson',
        avatar: profileData.avatar
      }
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Dean\'s List',
      date: '1 day ago',
      description: 'Achieved for Spring 2023 semester',
      icon: <Award className="w-5 h-5 text-yellow-500" />
    }
  ];

  // Education data
  const education = [
    {
      id: 1,
      institution: "Stanford University",
      degree: "B.S. Computer Science",
      period: "2020 - Present",
      description: "Specializing in Artificial Intelligence"
    },
    {
      id: 2,
      institution: "San Francisco High School",
      degree: "High School Diploma",
      period: "2016 - 2020",
      description: "Valedictorian"
    }
  ];

  // Interests data
  const interests = [
    {
      id: 1,
      name: "Web Development",
      image: "https://source.unsplash.com/random/300x200/?webdevelopment"
    },
    {
      id: 2,
      name: "Artificial Intelligence",
      image: "https://source.unsplash.com/random/300x200/?ai"
    },
    {
      id: 3,
      name: "Photography",
      image: "https://source.unsplash.com/random/300x200/?photography"
    },
    {
      id: 4,
      name: "Hiking",
      image: "https://source.unsplash.com/random/300x200/?hiking"
    }
  ];

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

            <ProfileActivity activities={activities as any} profileData={profileData} />
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

// Education Section Component
function EducationSection({ education }: { education: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Education</span>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{edu.institution}</h4>
              <p className="text-sm text-muted-foreground">{edu.degree}</p>
              <p className="text-xs text-muted-foreground mt-1">{edu.period}</p>
              {edu.description && (
                <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Interests Section Component
function InterestsSection({ interests }: { interests: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Interests</span>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {interests.map((interest) => (
            <div key={interest.id} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={interest.image}
                  alt={interest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                  <p className="text-sm font-medium text-white">{interest.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}