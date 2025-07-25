'use client';

import { useState, useRef , useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { User } from 'lucide-react';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { CreatePostModal } from '@/app/components/modals/CreatePostModal';
import { Edit, Plus, GraduationCap, Award, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileActivity from './components/ProfileActivity';

export default function ProfilePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Profile data
  const profileData = {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
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

  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowProfileMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="relative mb-16">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 w-full rounded-t-lg overflow-hidden bg-gray-200 relative">
            {profileData.coverPhoto ? (
              <Image
                src={profileData.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
                <span className="text-white/80">No cover photo</span>
              </div>
            )}
          </div>

          {/* Profile Photo and Info */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-6">
            <div className="flex items-end gap-4">
              <div className="relative -mt-12">
                <Avatar className="w-24 h-24 border-4 border-white rounded-full shadow-md">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="bg-gray-200">
                    <User className="w-8 h-8 text-gray-500" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{profileData.name}</h1>
                <p className="text-gray-600">{profileData.bio}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{profileData.university}</Badge>
                  <Badge variant="outline">{profileData.major}</Badge>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="relative mb-4" ref={menuRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <Link 
                    href="/profile/edit" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2 inline" />
                    Edit Profile
                  </Link>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

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
        <CardTitle>Education</CardTitle>
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
        <CardTitle>Interests</CardTitle>
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