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
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />
      
      <div className="flex flex-1">
        {/* Mobile responsive sidebar */}
        <div className="hidden md:block">
          <LeftSidebar />
        </div>
        
        {/* ✅ FIX: Added min-w-0 to prevent content from shrinking on small screens */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
          <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Main Content - full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Group Cover and Info */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={mockGroup.coverImage}
                      alt={mockGroup.name}
                      className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                      <div>
                        <h1 className="text-xl md:text-2xl font-bold">{mockGroup.name}</h1>
                        <p className="text-muted-foreground text-sm md:text-base">{mockGroup.memberCount} Members</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {mockGroup.isAdmin && (
                          <Button
                            variant={adminView ? "default" : "outline"}
                            size="sm"
                            onClick={() => setAdminView(!adminView)}
                            className="shadow-sm border"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {adminView ? "General View" : "Admin View"}
                          </Button>
                        )}
                        <Button
                          variant={membershipStatus === "joined" ? "outline" : membershipStatus === "leave" ? "destructive" : "default"}
                          size="sm"
                          onClick={handleJoinLeave}
                          className={`w-full sm:w-auto shadow-sm border ${membershipStatus === "leave" ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                        >
                          {membershipStatus === "join" && (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Join Group</span>
                              <span className="sm:hidden">Join</span>
                            </>
                          )}
                          {membershipStatus === "joined" && (
                            <>
                              <Users className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Joined</span>
                              <span className="sm:hidden">✓</span>
                            </>
                          )}
                          {membershipStatus === "leave" && (
                            <>
                              <UserMinus className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Leave Group</span>
                              <span className="sm:hidden">Leave</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Responsive Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                        <TabsTrigger value="images" className="text-xs sm:text-sm">Images</TabsTrigger>
                        <TabsTrigger value="posts" className="text-xs sm:text-sm">Posts</TabsTrigger>
                        <TabsTrigger value="pinned" className="text-xs sm:text-sm">Pinned</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Post Creation */}
              <Card className="cursor-pointer" onClick={() => setCreatePostOpen(true)}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 md:w-10 md:h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-3 cursor-pointer hover:bg-muted/80">
                        <p className="text-muted-foreground text-sm md:text-base">What's on your mind...</p>
                      </div>
                      <div className="flex items-center justify-between mt-3 md:mt-4">
                        <div className="flex items-center space-x-2 md:space-x-4">
                          <Button variant="ghost" size="sm" className="text-muted-foreground pointer-events-none p-1 md:p-2">
                            <ImageIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="text-xs md:text-sm">Photo</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground pointer-events-none p-1 md:p-2">
                            <Camera className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="text-xs md:text-sm">Video</span>
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
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm md:text-base">{post.author.name}</h4>
                          <p className="text-xs md:text-sm text-muted-foreground">{post.author.bio}</p>
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
                        className="p-1 md:p-2"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <p className="text-foreground text-sm md:text-base mb-3 md:mb-4">
                        {post.content}
                      </p>
                      
                      {post.images && post.images.length > 0 && (
                        <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                          {post.images.map((image, idx) => (
                            <div 
                              key={idx}
                              className="bg-gray-900 rounded-lg p-2 md:p-4 relative cursor-pointer hover:opacity-90"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageClick(image);
                              }}
                            >
                              <img 
                                src={image} 
                                alt={`Post ${post.id} image ${idx}`} 
                                className="w-full h-40 md:h-48 object-cover rounded opacity-80"
                              />
                              <div className="absolute bottom-2 left-2 text-white text-xs md:text-sm bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded">
                                {post.likes} Likes
                              </div>
                              <div className="absolute bottom-2 right-2 text-white text-xs md:text-sm bg-black/50 px-1 md:px-2 py-0.5 md:py-1 rounded">
                                {post.comments} comments
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 md:pt-4 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1 md:space-x-2 text-blue-600 p-1 md:p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">Like</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">Comment</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1 md:space-x-2 p-1 md:p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm">Share</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Sidebar - stacks below on mobile, on the side on lg+ */}
            {/* ✅ FIX: Removed `hidden lg:block` to allow it to stack on mobile */}
            <div className="space-y-4 md:space-y-6">
              {/* About this group */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold mb-2 md:mb-3">About this group</h3>
                  <p className="text-sm text-muted-foreground mb-3 md:mb-4">
                    {showFullDescription 
                      ? mockGroup.description 
                      : `${mockGroup.description.substring(0, 150)}...`}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary flex items-center text-sm"
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
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
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
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <h3 className="font-semibold">Pending Requests</h3>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Review member join requests</p>
                  </CardContent>
                </Card>
              )}

              {/* Admins */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold">Admins</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center text-sm"
                      onClick={() => setShowAllAdmins(!showAllAdmins)}
                    >
                      {showAllAdmins ? 'Show Less' : 'Show All'} 
                      {showAllAdmins ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {(showAllAdmins ? admins : admins.slice(0, 2)).map((admin) => (
                      <div 
                        key={admin.id} 
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                        onClick={() => handleMemberClick(admin.id)}
                      >
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
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
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="font-semibold">Members</h3>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center text-sm"
                      onClick={() => setShowAllMembers(!showAllMembers)}
                    >
                      {showAllMembers ? 'Show Less' : 'Show All'} 
                      {showAllMembers ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {(showAllMembers ? members : members.slice(0, 2)).map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                        onClick={() => handleMemberClick(member.id)}
                      >
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
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