'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { TopHeader } from '@/app/components/layout/topheader';
import { Edit, Plus, GraduationCap, Award, Upload, User, X, Eye } from 'lucide-react';
import Image from 'next/image';
import { Textarea } from '@/app/components/ui/textarea';

export default function EditProfilePage() {
  // Refs for file inputs
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  
  // State for profile data
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

  // State for file uploads
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  // Education data
  const [education, setEducation] = useState([
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
  ]);

  // Interests data
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
  ]);

  // Handle cover photo upload
  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverPhotoFile(e.target.files[0]);
      setShowCoverOptions(false);
    }
  };

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhotoFile(e.target.files[0]);
      setShowProfileOptions(false);
    }
  };

  // Remove cover photo
  const removeCoverPhoto = () => {
    setCoverPhotoFile(null);
    setProfileData({...profileData, coverPhoto: ""});
    setShowCoverOptions(false);
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    setProfilePhotoFile(null);
    setProfileData({...profileData, avatar: ""});
    setShowProfileOptions(false);
  };

  // Simulate upload
  const handleUpload = (type: 'cover' | 'profile') => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (type === 'cover' && coverPhotoFile) {
        setProfileData({...profileData, coverPhoto: URL.createObjectURL(coverPhotoFile)});
      } else if (type === 'profile' && profilePhotoFile) {
        setProfileData({...profileData, avatar: URL.createObjectURL(profilePhotoFile)});
      }
    }, 1500);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Profile updated:", profileData);
  };

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* Cover + Profile Photo Section */}
          <div className="relative w-full mb-16">
            {/* Cover Photo */}
            <div 
              className="h-48 md:h-64 w-full rounded-t-lg overflow-hidden bg-gray-200 relative group"
              onMouseEnter={() => setShowCoverOptions(true)}
              onMouseLeave={() => !isUploading && setShowCoverOptions(false)}
            >
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
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
                  <span className="text-white/80">No cover photo</span>
                </div>
              )}

              {/* Cover Photo Overlay Options */}
              {(showCoverOptions || isUploading) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
                  {isUploading ? (
                    <div className="text-white text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white/90 hover:bg-white text-gray-800"
                        onClick={() => coverPhotoRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {profileData.coverPhoto ? "Change Cover" : "Add Cover"}
                      </Button>
                      {profileData.coverPhoto && (
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800"
                          onClick={removeCoverPhoto}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove Cover
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div className="relative">
              <div 
                className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-md z-10 group"
                onMouseEnter={() => setShowProfileOptions(true)}
                onMouseLeave={() => !isUploading && setShowProfileOptions(false)}
              >
                <input
                  type="file"
                  ref={profilePhotoRef}
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
                
                {profileData.avatar ? (
                  <Image
                    src={profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : profileData.avatar}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                {/* Profile Photo Overlay Options */}
                {(showProfileOptions || isUploading) && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all">
                    {isUploading ? (
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-800 h-8"
                          onClick={() => profilePhotoRef.current?.click()}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {profileData.avatar && (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="bg-white/90 hover:bg-white text-gray-800 h-8"
                              onClick={() => window.open(profileData.avatar, '_blank')}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="bg-white/90 hover:bg-white text-gray-800 h-8"
                              onClick={removeProfilePhoto}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                <Button variant="ghost" size="sm" type="button" onClick={() => {
                  setEducation([...education, {
                    id: education.length + 1,
                    institution: "",
                    degree: "",
                    period: "",
                    description: ""
                  }]);
                }}>
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
                <Button variant="ghost" size="sm" type="button" onClick={() => {
                  setInterests([...interests, {
                    id: interests.length + 1,
                    name: "",
                    image: ""
                  }]);
                }}>
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
                        <img
                          src={interest.image}
                          alt={interest.name}
                          className="w-full h-full object-cover"
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
          <div className="flex justify-end mb-6">
            <Button type="submit" className="px-8">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}