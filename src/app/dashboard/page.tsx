"use client";

import { Search, Bell, MessageSquare, Calendar, Users, BookmarkCheck, Network } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import FeedPost from "@/app/components/dashboard/FeedPost";
import RightSidebar from "@/app/components/dashboard/RightSidebar";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}

const Dashboard = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: Users, label: "Groups", active: false },
    { icon: Calendar, label: "Events", active: false },
    { icon: BookmarkCheck, label: "Saved Items", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: Network, label: "Connections", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold campus-gradient-texty">CampusNet</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search" 
                className="pl-10 w-64 bg-gray-100 border-0"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <button className="text-purple-600 font-medium border-b-2 border-purple-600 pb-2">
                Feed
              </button>
              <button className="text-gray-600 hover:text-gray-900 pb-2">
                Notifications
              </button>
              <button className="text-gray-600 hover:text-gray-900 pb-2">
                Messages
              </button>
            </nav>
            
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-purple-100 text-purple-600">P</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Left Sidebar */}
       {/* Left Sidebar */}
<aside className="w-64 space-y-4">
  <Card className="rounded-lg shadow-sm">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <Avatar className="w-20 h-20 mb-4">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">JD</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold mb-1">John Doe</h2>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Badge
          variant="outline"
          className="rounded-full px-2 py-1 flex items-center space-x-1"
        >
          {/* You can replace this emoji with a real SVG or image for the university logo */}
          <span role="img" aria-label="university" className="text-yellow-600 text-lg">🎓</span>
          <span>ABCD University, Bangladesh</span>
        </Badge>
      </div>
    </CardContent>
  </Card>

  {/* Sidebar Navigation Items */}
  <Card>
    <CardContent className="p-0">
      <nav className="space-y-1">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 ${
              item.active ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600' : 'text-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </CardContent>
  </Card>
</aside>


        {/* Main Feed */}
        <main className="flex-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-200">U</AvatarFallback>
                </Avatar>
                <Input 
                  placeholder="What's on your mind..." 
                  className="flex-1 bg-gray-50 border-0"
                />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>📷</span>
                    <span className="text-sm">Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>📊</span>
                    <span className="text-sm">Event</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                    <span>📝</span>
                    <span className="text-sm">Poll</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <FeedPost />
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Dashboard;