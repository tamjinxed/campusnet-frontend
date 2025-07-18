// app/groups/page.tsx
'use client';

import { useState } from "react";
import { Search, Users, Calendar, BookmarkCheck, Network, CalendarDays } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import Image from "next/image";
import { CreateGroupModal } from "@/app/components/modals/CreateGroupModal";
import { TopHeader } from '@/app/components/layout/topheader';
import { LeftSidebar } from '@/app/components/dashboard/LeftSidebar';

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("your-groups");
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  const yourGroups = [
    {
      name: "ABC Robotics Club",
      members: "1000 Members",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/placeholder.svg"
    },
    {
      name: "Programming Society", 
      members: "850 Members", 
      description: "A community for coding enthusiasts to collaborate...",
      image: "/placeholder.svg"
    }
  ];

  const suggestedGroups = [
    {
      name: "Photography Club",
      members: "1200 Members",
      description: "For photography lovers to share tips and organize shoots...",
      image: "/placeholder.svg"
    },
    {
      name: "Debate Team", 
      members: "300 Members",
      description: "Join our competitive debate team and sharpen your skills...",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <TopHeader />

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Left Sidebar - Using the new component */}
        <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button 
                onClick={() => setActiveTab("your-groups")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "your-groups" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Your Groups
              </button>
              <button 
                onClick={() => setActiveTab("requested-groups")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "requested-groups" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Requested Groups
              </button>
            </div>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setIsCreateGroupModalOpen(true)}
            >
              Create Group
            </Button>
          </div>

          {/* Your Groups Content */}
          {activeTab === "your-groups" && (
            <div className="space-y-4">
              {yourGroups.map((group, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <Image 
                        src={group.image} 
                        alt={group.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.members}</p>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                            View Posts
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Groups You May be Interested In */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Groups You May be Interested In</h2>
            <div className="space-y-4">
              {suggestedGroups.map((group, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <Image 
                        src={group.image} 
                        alt={group.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.members}</p>
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                            Join
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        open={isCreateGroupModalOpen} 
        onOpenChange={setIsCreateGroupModalOpen} 
      />
    </div>
  );
}