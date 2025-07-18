"use client";

import { Image, CalendarDays, ListChecks, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import FeedPost from "@/app/components/dashboard/FeedPost";
import RightSidebar from "@/app/components/dashboard/RightSidebar";
import { useState } from "react";
import { CreatePostModal } from "@/app/components/modals/CreatePostModal";
import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";

export default function Dashboard() {
  const router = useRouter();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Feed */}
        <main className="flex-1 space-y-6">
          {/* Create Post Card */}
          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gray-200">U</AvatarFallback>
                </Avatar>
                <Input 
                  placeholder="What's on your mind..." 
                  className="flex-1 bg-gray-50 border-0 cursor-pointer"
                  onClick={() => setIsCreatePostOpen(true)}
                  readOnly
                />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex space-x-4">
                  <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm">Photo</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span className="text-sm">Event</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsCreatePostOpen(true)}
                  >
                    <ListChecks className="w-5 h-5" />
                    <span className="text-sm">Poll</span>
                  </button>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-purple-600 hover:text-purple-800 font-medium"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          <FeedPost />
          <FeedPost />
          <FeedPost />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen} 
      />
    </div>
  );
}