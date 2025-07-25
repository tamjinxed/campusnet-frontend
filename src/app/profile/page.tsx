'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { CreatePostModal } from '@/app/components/modals/CreatePostModal';
import { Edit, Plus, GraduationCap, Award, Upload, User, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export default function ProfilePage() {
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

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
      icon: <Award className="w-5 h-5 text-yellow-500" />,
      user: {
        name: 'Alex Johnson',
        avatar: profileData.avatar
      }
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

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingCover(true);
      setTimeout(() => {
        setCoverPhoto(URL.createObjectURL(e.target.files![0]));
        setIsUploadingCover(false);
      }, 1000);
    }
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingProfile(true);
      setTimeout(() => {
        setProfilePhoto(URL.createObjectURL(e.target.files![0]));
        setIsUploadingProfile(false);
      }, 1000);
    }
  };

  const handleDeleteCoverPhoto = () => {
    setCoverPhoto(null);
  };

  const handleDeleteProfilePhoto = () => {
    setProfilePhoto(null);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        {/* Cover Photo and Profile Photo Section */}
        <div className="relative w-full mb-16">
          {/* Cover Photo */}
          <div className="h-48 w-full rounded-t-lg overflow-hidden bg-gray-200 relative group">
            <input
              type="file"
              ref={coverPhotoRef}
              onChange={handleCoverPhotoUpload}
              className="hidden"
              accept="image/*"
            />
            
            {coverPhoto || profileData.coverPhoto ? (
              <Image
                src={coverPhoto || profileData.coverPhoto}
                alt="Cover"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No cover photo</span>
              </div>
            )}

            {/* Cover Photo Edit Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white/90 hover:bg-white text-gray-800"
                  onClick={() => coverPhotoRef.current?.click()}
                  disabled={isUploadingCover}
                >
                  {isUploadingCover ? 'Uploading...' : 'Upload Cover'}
                </Button>
                {(coverPhoto || profileData.coverPhoto) && (
                  <Button
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-gray-800"
                    onClick={handleDeleteCoverPhoto}
                    disabled={isUploadingCover}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Semi-transparent Edit Cover Button (always visible) */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={() => coverPhotoRef.current?.click()}
                disabled={isUploadingCover}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Cover
              </Button>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="absolute -bottom-16 left-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-md group">
                  {isUploadingProfile ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Uploading...</span>
                    </div>
                  ) : profilePhoto || profileData.avatar ? (
                    <Image
                      src={profilePhoto || profileData.avatar}
                      alt="Profile"
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Profile Photo Edit Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem 
                  onClick={() => profilePhotoRef.current?.click()}
                  disabled={isUploadingProfile}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile Photo
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.open(profilePhoto || profileData.avatar, '_blank')}
                  disabled={!profilePhoto && !profileData.avatar}
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile Photo
                </DropdownMenuItem>
                {(profilePhoto || profileData.avatar) && (
                  <DropdownMenuItem 
                    onClick={handleDeleteProfilePhoto} 
                    className="text-red-500"
                    disabled={isUploadingProfile}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Photo
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <input
              type="file"
              ref={profilePhotoRef}
              onChange={handleProfilePhotoUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Edit Profile Button */}
          <div className="absolute right-6 -bottom-16">
            <Button onClick={handleEditProfile}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold">{profileData.name}</h1>
          <p className="text-muted-foreground">{profileData.bio}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">{profileData.location}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{profileData.university}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm">
              <span className="font-semibold">{profileData.connections}</span> connections
            </span>
            <span className="text-sm">
              <span className="font-semibold">{profileData.posts}</span> posts
            </span>
            <span className="text-sm">
              Joined <span className="font-semibold">{profileData.joinedDate}</span>
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
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
                    <AvatarImage src={profilePhoto || profileData.avatar} />
                    <AvatarFallback>{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-muted-foreground">
                    What's on your mind, {profileData.name.split(' ')[0]}?
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activities Section */}
            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="space-y-2">
                      {activity.type === 'post' ? (
                        <>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={activity.user?.avatar || ''} />
                              <AvatarFallback>
                                {activity.user?.name?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{activity.user?.name}</h4>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <p className="ml-14">{activity.content}</p>
                          <div className="flex gap-4 ml-14 text-sm text-muted-foreground">
                            <span>{activity.likes} likes</span>
                            <span>{activity.comments} comments</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              {activity.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <p className="ml-14 text-sm">{activity.description}</p>
                        </>
                      )}
                    </div>
                    {index < activities.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Education Section */}
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

            {/* Interests Section */}
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
                        <Image
                          src={interest.image}
                          alt={interest.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
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