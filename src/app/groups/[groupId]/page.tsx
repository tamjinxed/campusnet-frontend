'use client';

import React, {useEffect, useState} from "react";
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
import api from "@/app/lib/axios";
import {useAuth} from "@/app/context/AuthContext";
import FeedPost from "@/app/components/dashboard/FeedPost";
import {toUpperCase} from "uri-js/dist/esnext/util";
import {numericStringToUuid} from "@/app/utils/utils";

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

// eslint-disable-next-line @next/next/no-async-client-component
const SingleGroup = ({ params }: { params: Promise<{ groupId: string }> }) => {


  let { groupId } = React.use(params);
  groupId = numericStringToUuid(groupId);
  const { user } = useAuth();

  // Storing group info, member info, admins and moderators and group posts
  const [group, setGroup] = useState<[]>([]);
  const [members, setMembers] = useState<[]>([]);
  const [generatlMembers, setGeneralMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pinnedPosts, setPinnedPosts] = useState([]);

  const [membershipStatus, setMembershipStatus] = useState("joined"); // "join", "joined", "leave"
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getGroupInfo();
    getGroupMembers();
    getGroupPosts();

    const currentUserIsMember = members?.filter(memeber => member.id === user.id).length > 0;
    if (currentUserIsMember) {
      setMembershipStatus("joined");
    } else {
      setMembershipStatus("join");
    }

    const currentUserIsAdmin = admins?.filter(admin => admin.id === user.id).length > 0;
    if (currentUserIsAdmin) {
      setIsAdmin(true);
    }

  }, []);

  const getGroupInfo = async () => {
    const { data: { data : groupInfo } } = await api.get(`/groups/${groupId}`);
    setGroup(groupInfo.group);
  }

  const getGroupMembers = async () => {
    const { data: { data : groupMembers } } = await api.get(`/groups/${groupId}/members?page=1&limit=50`);
    setMembers(groupMembers.members);

    // Filter general members, admins and moderators
    const generalGroupMembers = groupMembers.members.filter(member => member.role === "member");
    const adminGroupMembers = groupMembers.members.filter(member => member.role === "admin");
    const moderatorGroupMembers = groupMembers.members.filter(member => member.role === "moderator");

    setGeneralMembers(generalGroupMembers);
    setAdmins(adminGroupMembers);
    setModerators(moderatorGroupMembers);
  }

  const getGroupPosts = async () => {
    const { data: { data : groupPosts } } = await api.get(`/posts?page=1&limit=50&groupId=${groupId}`);

    // Filter posts
    const filterPinnedPost = groupPosts.posts.filter(post => post.isPinned === true);

    setPinnedPosts(filterPinnedPost);

    setPosts(groupPosts.posts);
  }

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [adminView, setAdminView] = useState(false);
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
                    {group.coverImage && <img
                        src={group.coverImage}
                        alt={group.name}
                        className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                    />}
                    {!group.coverImage && <div style={{"background": "radial-gradient(69.45% 69.45% at 89.46% 81.73%, rgb(100, 30, 12) 0%, rgb(80, 15, 57) 43.54%, rgb(6, 1, 65) 100%) center center"}} className="w-full h-48 md:h-64 bg-gray-100 rounded-t-lg"></div>}
                    <div className="absolute top-4 right-4">
                      <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                      <div>
                        <h1 className="text-xl md:text-2xl font-bold">{group.name}</h1>
                        <p className="text-muted-foreground text-sm md:text-base">{group.memberCount} Members</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isAdmin && (
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
              {posts.map((post) => (
                <FeedPost key={post.id} post={post} />
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
                      ? group.description
                      : `${group.description?.substring(0, 150)}...`}
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
              {(isAdmin && adminView) && (
                <Card className="cursor-pointer" onClick={() => router.push(`/groups/${groupId}/pending/posts`)}>
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
              {(isAdmin && adminView) && (
                <Card className="cursor-pointer" onClick={() => router.push(`/groups/${groupId}/member-requests`)}>
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
                        key={admin.memberId}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                        onClick={() => handleMemberClick(admin.memberId)}
                      >
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
                          <AvatarImage src={admin.profilePicture} />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {admin.firstName[0]}{admin.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{admin.firstName} {admin.lastName}</h4>
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
                    {(showAllMembers ? members : generatlMembers.slice(0, 2)).map((member) => (
                      <div 
                        key={member.memberId}
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                        onClick={() => handleMemberClick(member.memberId)}
                      >
                        <Avatar className="w-8 h-8 md:w-10 md:h-10">
                          <AvatarImage src={member.profilePicture} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {member.firstName[0]}{member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{member.firstName} {member.lastName}</h4>
                          <p className="text-xs text-muted-foreground">{member.bio}</p>
                          <Badge variant="outline" className="text-xs mt-1">{toUpperCase(member.role)}</Badge>
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