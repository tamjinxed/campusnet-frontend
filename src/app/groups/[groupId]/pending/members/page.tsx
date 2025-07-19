'use client';

import { useState } from "react";
import { ArrowLeft, Check, X, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";

const PendingMembers = ({ params }: { params: { groupId: string } }) => {
  const router = useRouter();
  
  const pendingMembers = [
    {
      id: 1,
      name: "Alex Rodriguez",
      role: "Student at AICD University",
      joinDate: "2 hours ago",
      mutualConnections: 5
    },
    {
      id: 2,
      name: "Emily Zhang",
      role: "Graduate Student",
      joinDate: "1 day ago",
      mutualConnections: 12
    },
    {
      id: 3,
      name: "David Kim",
      role: "PhD Candidate",
      joinDate: "2 days ago",
      mutualConnections: 8
    }
  ];

  const handleApprove = (memberId: number) => {
    console.log("Approved member:", memberId);
  };

  const handleReject = (memberId: number) => {
    console.log("Rejected member:", memberId);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-4"
                onClick={() => router.push(`/groups/${params.groupId}`)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Pending Member Requests</h1>
                <p className="text-muted-foreground">Review and approve new members for ABC University Community</p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs text-muted-foreground">Requested {member.joinDate}</p>
                            <p className="text-xs text-muted-foreground">{member.mutualConnections} mutual connections</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(member.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(member.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PendingMembers;