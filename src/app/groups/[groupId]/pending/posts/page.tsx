'use client';

import { useState } from "react";
import { ArrowLeft, MoreHorizontal, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";

const PendingPosts = ({ params }: { params: { groupId: string } }) => {
  const router = useRouter();
  
  const pendingPosts = [
    {
      id: 1,
      author: "Sarah Johnson",
      authorRole: "Student at AICD University",
      content: "Hey everyone! I'm organizing a study group for the upcoming finals. Anyone interested in joining? We'll meet at the library every Tuesday and Thursday.",
      timestamp: "2 hours ago",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      author: "Mike Chen",
      authorRole: "Graduate Student",
      content: "Found some great resources for machine learning that I wanted to share with the community. These tutorials really helped me understand the concepts better.",
      timestamp: "4 hours ago",
      image: null
    }
  ];

  const handleApprove = (postId: number) => {
    console.log("Approved post:", postId);
  };

  const handleReject = (postId: number) => {
    console.log("Rejected post:", postId);
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
                <h1 className="text-2xl font-bold">Pending Posts</h1>
                <p className="text-muted-foreground">Review and approve posts for ABC University Community</p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{post.author}</h4>
                          <p className="text-sm text-muted-foreground">{post.authorRole}</p>
                          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-foreground mb-4">{post.content}</p>
                      
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt="Post content" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(post.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(post.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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

export default PendingPosts;