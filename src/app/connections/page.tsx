"use client"; // Add this since we're using interactive elements

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
    // ... rest of the connections data
  ];

  const stats = [
    { icon: Users, label: "Total Connections", value: "127", color: "text-purple-600" },
    { icon: UserPlus, label: "Pending Requests", value: "5", color: "text-blue-600" },
    { icon: MessageCircle, label: "Active Chats", value: "23", color: "text-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        <LeftSidebar />

        <main className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color}`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  placeholder="Search connections by name, field, or university..." 
                  className="pl-10 h-12"
                />
              </div>
            </CardContent>
          </Card>

          {/* Connections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((connection) => (
              <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={connection.avatar} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                      <p className="text-sm text-gray-600">{connection.role}</p>
                      <p className="text-xs text-gray-500">{connection.university}</p>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {connection.mutualConnections} mutual connections
                    </div>
                    
                    <div className="flex space-x-2 w-full">
                      {connection.isConnected ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
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