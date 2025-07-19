'use client';

import { useState } from "react";
import { Heart, MessageSquare, Share, MoreHorizontal, Camera, Image as ImageIcon, Users, Settings, Shield, UserPlus, UserMinus, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";

import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { CreatePostModal } from "@/app/components/modals/CreatePostModal";

// Define interfaces
interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  coverImage: string;
  isAdmin: boolean;
}

interface Member {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  avatar: string;
  bio: string;
}

interface Post {
  id: number;
  author: Member;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isPinned?: boolean;
}

// Mock data
const mockGroup: Group = {
  id: "1",
  name: "ABC University Community",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  memberCount: 753,
  coverImage: "https://images.unsplash.com/photo-1549451371-64aa98a6f0c2?w=800&h=300&fit=crop",
  isAdmin: true
};

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Ben den Engelsen",
    role: "ADMIN",
    avatar: "/placeholder.svg",
    bio: "Student at AICD University, Bangladesh"
  },
  {
    id: "2",
    name: "John Doe",
    role: "MEMBER",
    avatar: "/placeholder.svg",
    bio: "Student at AICD University, Bangladesh"
  },
  {
    id: "3",
    name: "Jane Smith",
    role: "MEMBER",
    avatar: "/placeholder.svg",
    bio: "Professor at AICD University"
  }
];

const mockPosts: Post[] = [
  {
    id: 1,
    author: mockMembers[1],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop"],
    likes: 100,
    comments: 5,
    timestamp: "5 min",
    isPinned: true
  },
  {
    id: 2,
    author: mockMembers[2],
    content: "Just shared some photos from our last university event! Check them out!",
    images: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop"
    ],
    likes: 45,
    comments: 12,
    timestamp: "2 hours"
  },
  {
    id: 3,
    author: mockMembers[0],
    content: "Important announcement about upcoming exams...",
    likes: 78,
    comments: 23,
    timestamp: "1 day",
    isPinned: true
  }
];

const SingleGroup = ({ params }: { params: { groupId: string } }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [adminView, setAdminView] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState("joined"); // "join", "joined", "leave"
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const handleJoinLeave = () => {
    if (membershipStatus === "join") {
      setMembershipStatus("joined");
    } else if (membershipStatus === "joined") {
      setMembershipStatus("leave");
    } else {
      setMembershipStatus("join");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    console.log("Opening image:", imageUrl);
    // Here you would open image in a modal or lightbox
  };

  const handlePostClick = (postId: number) => {
    router.push(`/groups/${params.groupId}/posts/${postId}`);
  };

  const handleMemberClick = (memberId: string) => {
    router.push(`/profile/${memberId}`);
  };

  // Filter posts based on active tab
  const filteredPosts = () => {
    switch (activeTab) {
      case "images":
        return mockPosts.filter(post => post.images && post.images.length > 0);
      case "posts":
        return mockPosts.filter(post => !post.images || post.images.length === 0);
      case "pinned":
        return mockPosts.filter(post => post.isPinned);
      default:
        return mockPosts;
    }
  };

  // Get admins and members
  const admins = mockMembers.filter(member => member.role === "ADMIN");
  const members = mockMembers.filter(member => member.role === "MEMBER");

  return (
    <div className="min-h-screen bg-background">
      <TopHeader />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Group Cover and Info */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={mockGroup.coverImage}
                      alt={mockGroup.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-2xl font-bold">{mockGroup.name}</h1>
                        <p className="text-muted-foreground">{mockGroup.memberCount} Members</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {mockGroup.isAdmin && (
                          <Button
                            variant={adminView ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAdminView(!adminView)}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {adminView ? "General View" : "Admin View"}
                          </Button>
                        )}
                        <Button
                          variant={membershipStatus === "joined" ? "outline" : "default"}
                          size="sm"
                          onClick={handleJoinLeave}
                        >
                          {membershipStatus === "join" && (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Join Group
                            </>
                          )}
                          {membershipStatus === "joined" && (
                            <>
                              <Users className="w-4 h-4 mr-2" />
                              Joined
                            </>
                          )}
                          {membershipStatus === "leave" && (
                            <>
                              <UserMinus className="w-4 h-4 mr-2" />
                              Leave Group
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="images">Images</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="pinned">Pinned</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Post Creation */}
              <Card className="cursor-pointer" onClick={() => setCreatePostOpen(true)}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3 cursor-pointer hover:bg-muted/80">
                        <p className="text-muted-foreground">What's on your mind...</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground pointer-events-none">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground pointer-events-none">
                            <Camera className="w-4 h-4 mr-2" />
                            Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Posts */}
              {filteredPosts().map((post) => (
                <Card key={post.id} className="cursor-pointer" onClick={() => handlePostClick(post.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{post.author.name}</h4>
                          <p className="text-sm text-muted-foreground">{post.author.bio}</p>
                          <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                          {post.isPinned && (
                            <Badge variant="secondary" className="text-xs mt-1">PINNED</Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle post options
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <p className="text-foreground mb-4">
                        {post.content}
                      </p>
                      
                      {post.images && post.images.length > 0 && (
                        <div className="grid gap-2" style={{ 
                          gridTemplateColumns: post.images.length > 1 ? '1fr 1fr' : '1fr'
                        }}>
                          {post.images.map((image, idx) => (
                            <div 
                              key={idx}
                              className="bg-gray-900 rounded-lg p-4 relative cursor-pointer hover:opacity-90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(image);
                              }}
                            >
                              <img 
                                src={image} 
                                alt={`Post ${post.id} image ${idx}`} 
                                className="w-full h-48 object-cover rounded opacity-80"
                              />
                              <div className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                                {post.likes} Likes
                              </div>
                              <div className="absolute bottom-2 right-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                                {post.comments} comments
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2 text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Like</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share className="w-4 h-4" />
                        <span>Share</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* About this group */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">About this group</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {showFullDescription 
                      ? mockGroup.description 
                      : `${mockGroup.description.substring(0, 150)}...`}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary flex items-center"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'} 
                    {showFullDescription ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                  </Button>
                </CardContent>
              </Card>

              {/* Pending Posts */}
              {(mockGroup.isAdmin && adminView) && (
                <Card className="cursor-pointer" onClick={() => router.push(`/groups/${params.groupId}/pending/posts`)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Pending Posts</h3>
                      <Badge variant="secondary">10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Review posts waiting for approval</p>
                  </CardContent>
                </Card>
              )}

              {/* Pending Requests */}
              {(mockGroup.isAdmin && adminView) && (
                <Card className="cursor-pointer" onClick={() => router.push(`/groups/${params.groupId}/pending/members`)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Pending Requests</h3>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Review member join requests</p>
                  </CardContent>
                </Card>
              )}

              {/* Admins */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Admins</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center"
                      onClick={() => setShowAllAdmins(!showAllAdmins)}
                    >
                      {showAllAdmins ? 'Show Less' : 'Show All'} 
                      {showAllAdmins ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(showAllAdmins ? admins : admins.slice(0, 2)).map((admin) => (
                      <div 
                        key={admin.id} 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                        onClick={() => handleMemberClick(admin.id)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={admin.avatar} />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{admin.name}</h4>
                          <p className="text-xs text-muted-foreground">{admin.bio}</p>
                          <Badge variant="outline" className="text-xs mt-1">ADMIN</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Members */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Members</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center"
                      onClick={() => setShowAllMembers(!showAllMembers)}
                    >
                      {showAllMembers ? 'Show Less' : 'Show All'} 
                      {showAllMembers ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(showAllMembers ? members : members.slice(0, 2)).map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                        onClick={() => handleMemberClick(member.id)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{member.name}</h4>
                          <p className="text-xs text-muted-foreground">{member.bio}</p>
                          <Badge variant="outline" className="text-xs mt-1">MEMBER</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <CreatePostModal 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen} 
      />
    </div>
  );
};

export default SingleGroup;