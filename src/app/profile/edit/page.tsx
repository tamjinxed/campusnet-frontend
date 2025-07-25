'use client';

import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { Edit, Plus, GraduationCap, Award, Upload, User, X, Eye, Check, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/app/components/ui/textarea';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export default function EditProfilePage() {
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
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
  });

  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const [education, setEducation] = useState([
    {
      id: 1,
      institution: "Stanford University",
      degree: "B.S. Computer Science",
      period: "2020 - Present",
      description: "Specializing in Artificial Intelligence"
    }
  ]);

  const [interests, setInterests] = useState([
    {
      id: 1,
      name: "Web Development",
      image: "https://source.unsplash.com/random/300x200/?webdevelopment"
    },
    {
      id: 2,
      name: "Artificial Intelligence",
      image: "https://source.unsplash.com/random/300x200/?ai"
    }
  ]);

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverPhotoFile(e.target.files[0]);
      setIsUploadingCover(true);
      setTimeout(() => {
        setProfileData({...profileData, coverPhoto: URL.createObjectURL(e.target.files![0])});
        setIsUploadingCover(false);
      }, 1000);
    }
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePhotoFile(e.target.files[0]);
      setIsUploadingProfile(true);
      setTimeout(() => {
        setProfileData({...profileData, avatar: URL.createObjectURL(e.target.files![0])});
        setIsUploadingProfile(false);
      }, 1000);
    }
  };

  const removeCoverPhoto = () => {
    setCoverPhotoFile(null);
    setProfileData({...profileData, coverPhoto: ""});
  };

  const removeProfilePhoto = () => {
    setProfilePhotoFile(null);
    setProfileData({...profileData, avatar: ""});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* Cover + Profile Photo Section - Consistent with Profile Page */}
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
              
              {profileData.coverPhoto ? (
                <Image
                  src={coverPhotoFile ? URL.createObjectURL(coverPhotoFile) : profileData.coverPhoto}
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
                    type="button"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-gray-800"
                    onClick={() => coverPhotoRef.current?.click()}
                    disabled={isUploadingCover}
                  >
                    {isUploadingCover ? 'Uploading...' : 'Upload Cover'}
                  </Button>
                  {profileData.coverPhoto && (
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-gray-800"
                      onClick={removeCoverPhoto}
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
                  type="button"
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

            {/* Profile Photo - Consistent with Profile Page */}
            <div className="absolute -bottom-16 left-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-md group">
                    {isUploadingProfile ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">Uploading...</span>
                      </div>
                    ) : profileData.avatar ? (
                      <Image
                        src={profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : profileData.avatar}
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
                <DropdownMenuContent 
  align="start" 
  className="w-48 bg-white border border-gray-200 rounded-md shadow-lg"
>
  <DropdownMenuItem 
    onClick={() => profilePhotoRef.current?.click()}
    disabled={isUploadingProfile}
    className="hover:bg-gray-100 focus:bg-gray-100"
  >
    <Edit className="w-4 h-4 mr-2" />
    Edit Profile Photo
  </DropdownMenuItem>
  <DropdownMenuItem 
    onClick={() => window.open(profileData.avatar, '_blank')}
    disabled={!profileData.avatar}
    className="hover:bg-gray-100 focus:bg-gray-100"
  >
    <Eye className="w-4 h-4 mr-2" />
    View Profile Photo
  </DropdownMenuItem>
  {profileData.avatar && (
    <DropdownMenuItem 
      onClick={removeProfilePhoto} 
      className="text-red-500 hover:bg-gray-100 focus:bg-gray-100"
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
          </div>

          {/* Basic Info Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    value={profileData.university}
                    onChange={(e) => setProfileData({...profileData, university: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="major">Major</Label>
                  <Input
                    id="major"
                    value={profileData.major}
                    onChange={(e) => setProfileData({...profileData, major: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={profileData.year}
                    onChange={(e) => setProfileData({...profileData, year: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Education</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => {
                    setEducation([...education, {
                      id: education.length + 1,
                      institution: "",
                      degree: "",
                      period: "",
                      description: ""
                    }]);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
                <div key={edu.id} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].institution = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Institution"
                    />
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].degree = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Degree"
                    />
                    <Input
                      value={edu.period}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].period = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Period (e.g. 2020 - 2024)"
                    />
                    <Textarea
                      value={edu.description}
                      onChange={(e) => {
                        const newEducation = [...education];
                        newEducation[index].description = e.target.value;
                        setEducation(newEducation);
                      }}
                      placeholder="Description"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setEducation(education.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Interests</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => {
                    setInterests([...interests, {
                      id: interests.length + 1,
                      name: "",
                      image: ""
                    }]);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {interests.map((interest, index) => (
                  <div key={interest.id} className="group relative">
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      {interest.image ? (
                        <Image
                          src={interest.image}
                          alt={interest.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2">
                        <Input
                          value={interest.name}
                          onChange={(e) => {
                            const newInterests = [...interests];
                            newInterests[index].name = e.target.value;
                            setInterests(newInterests);
                          }}
                          className="bg-transparent border-none text-white placeholder:text-white/70 h-6 p-0 text-sm font-medium"
                          placeholder="Interest name"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      type="button"
                      onClick={() => {
                        setInterests(interests.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4 mb-6">
            <Link href="/profile">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="px-8">
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}