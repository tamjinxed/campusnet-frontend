"use client";

import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Search, UserPlus, Users, MessageCircle } from "lucide-react";

const Connections = () => {
  const connections = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      university: "AICD University",
      mutualConnections: 12,
      isConnected: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Software Engineering Student", 
      university: "AICD University",
      mutualConnections: 8,
      isConnected: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      role: "Data Science Student",
      university: "AICD University",
      mutualConnections: 5,
      isConnected: false,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Emily Wilson",
      role: "Cybersecurity Student",
      university: "AICD University",
      mutualConnections: 3,
      isConnected: false,
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      name: "David Kim",
      role: "AI Research Student",
      university: "AICD University",
      mutualConnections: 7,
      isConnected: true,
      avatar: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Jessica Lee",
      role: "Web Development Student",
      university: "AICD University",
      mutualConnections: 9,
      isConnected: true,
      avatar: "/placeholder.svg"
    }
  ];

  const stats = [
    { icon: Users, label: "Total Connections", value: "127", color: "text-purple-600" },
    { icon: UserPlus, label: "Pending Requests", value: "5", color: "text-blue-600" },
    { icon: MessageCircle, label: "Active Chats", value: "23", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-4 md:gap-6 p-4 md:p-6">
        {/* Left Sidebar - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
          <LeftSidebar />
        </div>

        <main className="flex-1 space-y-4 md:space-y-6 overflow-x-hidden">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <Input 
                  placeholder="Search connections..." 
                  className="pl-10 h-10 md:h-12 text-sm md:text-base"
                />
              </div>
            </CardContent>
          </Card>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {connections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
                    <Avatar className="w-14 h-14 md:w-16 md:h-16">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-sm md:text-base">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{connection.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600">{connection.role}</p>
                      <p className="text-xs text-gray-500">{connection.university}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {connection.mutualConnections} mutual connections
                    </div>
                    
                    <div className="flex space-x-2 w-full">
                      {connection.isConnected ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm">
                            <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm">
                            View Profile
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs md:text-sm">
                            <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm">
                            View Profile
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Connections;