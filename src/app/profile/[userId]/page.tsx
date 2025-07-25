'use client';

import { notFound } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { TopHeader } from '@/app/components/layout/topheader';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileActivity from '../../components/ProfileActivity';

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  // Fetch user data based on params.userId
  const profileData = {
    name: "Sarah Chen",
    avatar: `https://example.com/avatar.jpg`,
    coverPhoto: "https://images.unsplash.com/photo-1581092921461-39b2f2f8d6f8?w=800&h=300&fit=crop",
    bio: "Digital Marketing enthusiast",
    location: "Berkeley, CA",
    university: "UC Berkeley",
    connections: 128,
    posts: 42,
    joinedDate: "January 2021"
  };

  if (!profileData) return notFound();

  return (
    <div className="min-h-screen bg-muted">
      <TopHeader />
      
      <div className="container mx-auto px-4 py-6">
        <ProfileHeader 
          profileData={profileData} 
          isOwnProfile={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ProfileActivity 
              activities={[]} 
              profileData={profileData} 
            />
          </div>
          
          {/* Right Column - Add additional sections if needed */}
          <div className="space-y-6">
            {/* Example: Can add education, interests etc. */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-600">{profileData.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}