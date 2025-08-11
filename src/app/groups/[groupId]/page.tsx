"use client"

import React, { useEffect, useState, useRef } from "react"
import {
    MessageSquare,
    MoreHorizontal,
    Camera,
    ImageIcon,
    Users,
    Shield,
    UserPlus,
    UserMinus,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Clock,
    Eye,
    EyeOff,
    Crown,
    UserCheck,
    Edit,
    Settings,
    Upload, Image, CalendarDays, ListChecks, Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Textarea } from "@/app/components/ui/textarea"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Switch } from "@/app/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

import { TopHeader } from "@/app/components/layout/topheader"
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar"
import { CreatePostModal } from "@/app/components/modals/CreatePostModal"
import api from "@/app/lib/axios"
import { useAuth } from "@/app/context/AuthContext"
import FeedPost from "@/app/components/dashboard/FeedPost"
import {numericStringToUuid, uuidToNumericString} from "@/app/utils/utils"
import { toast } from "react-hot-toast"
import { supabaseAdmin } from "@/app/lib/supabase"

// Define interfaces
interface Group {
    id: string
    name: string
    description: string
    rules: string
    memberCount: number
    coverImage: string
    logo: string
    isPublic: boolean
    memberApprovalRequired: boolean
    postApprovalRequired: boolean
    createdAt: string
    communityId: string
}

interface Member {
    memberId: string
    userId: string
    groupId: string
    role: "admin" | "member" | "moderator"
    joinedAt: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePicture: string
    bio: string
    universityName: string
    universityLogoUrl: string
}

interface JoinRequest {
    requestId: string
    groupId: string
    userId: string
    status: "pending" | "approved" | "rejected"
    requestedAt: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePicture: string
    bio: string
    universityName: string
}

interface Post {
    id: number
    content: string
    images?: string[]
    authorFirstName: string
    authorLastName: string
    authorProfilePicture: string
    authorUniversity: string
    authorUniversityCountry: string
    approved_at: string
    reactions: any[]
    reactionCount: number
    commentCount: number
    comments: any[]
    isPinned?: boolean
    isPublic: boolean
    status: "pending" | "approved" | "rejected"
}

const SingleGroup = ({ params }: { params: Promise<{ groupId: string }> }) => {
    let { groupId } = React.use(params)
    groupId = numericStringToUuid(groupId)
    const { user } = useAuth()
    const router = useRouter()

    // State management
    const [group, setGroup] = useState<Group | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [generalMembers, setGeneralMembers] = useState<Member[]>([])
    const [admins, setAdmins] = useState<Member[]>([])
    const [moderators, setModerators] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [pendingPosts, setPendingPosts] = useState<Post[]>([])
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])

    const [membershipStatus, setMembershipStatus] = useState<"join" | "joined" | "pending" | "rejected">("join")
    const [userRole, setUserRole] = useState<"admin" | "member" | "moderator" | null>(null)
    const [loading, setLoading] = useState(true)

    // Add these refs
    const coverPhotoRef = useRef<HTMLInputElement>(null)
    const profilePhotoRef = useRef<HTMLInputElement>(null)

    // Add upload states
    const [isUploadingCover, setIsUploadingCover] = useState(false)
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)

    // UI state
    const [activeTab, setActiveTab] = useState("posts")
    const [showAllAdmins, setShowAllAdmins] = useState(false)
    const [showAllMembers, setShowAllMembers] = useState(false)
    const [adminView, setAdminView] = useState(false)
    const [createPostOpen, setCreatePostOpen] = useState(false)

    // Modal states
    const [showEditGroupModal, setShowEditGroupModal] = useState(false)
    const [rejectReason, setRejectReason] = useState("")
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null)
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    // Edit group state
    const [editGroupData, setEditGroupData] = useState({
        name: "",
        description: "",
        rules: "",
        coverImage: "",
        logo: "",
        isPublic: true,
        memberApprovalRequired: false,
        postApprovalRequired: false,
    })

    // Check user permissions
    const isAdmin = userRole === "admin"
    const isModerator = userRole === "moderator" || userRole === "admin"
    const isMember = membershipStatus === "joined"
    const canManageGroup = isAdmin || isModerator

    const uploadFile = async (file: File, type: "cover" | "logo") => {
        try {
            const { data: signedUrlData } = await api.post("/upload/signed-url", {
                fileName: file?.name,
                fileType: file?.type,
            })

            const { signedUrl, path } = signedUrlData.data

            await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            })

            const { data: publicUrlData } = supabaseAdmin.storage.from("images").getPublicUrl(path)

            return publicUrlData.publicUrl
        } catch (error) {
            console.error(`${type} upload failed:`, error)
            toast.error(`Failed to upload ${type} image`)
            throw error
        }
    }

    const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            setIsUploadingCover(true)

            try {
                const imageUrl = await uploadFile(file, "cover")
                setEditGroupData({ ...editGroupData, coverImage: imageUrl })
                toast.success("Cover image uploaded successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingCover(false)
            }
        }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0]
            setIsUploadingLogo(true)

            try {
                const imageUrl = await uploadFile(file, "logo")
                setEditGroupData({ ...editGroupData, logo: imageUrl })
                toast.success("Logo uploaded successfully")
            } catch (err) {
                // Error already handled in uploadFile
            } finally {
                setIsUploadingLogo(false)
            }
        }
    }

    useEffect(() => {
        if (user) {
            fetchAllData()
        }
    }, [user, groupId])

    const fetchAllData = async () => {
        try {
            setLoading(true)
            // First fetch group info and members to determine user role
            await Promise.all([fetchGroupInfo(), fetchGroupMembers()])
        } catch (error) {
            console.error("Error fetching group data:", error)
            toast.error("Failed to load group data")
        } finally {
            setLoading(false)
        }
    }

    const fetchGroupInfo = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}`)
            const groupData = data.data.group
            setGroup(groupData)

            // Set edit form data
            setEditGroupData({
                name: groupData.name || "",
                description: groupData.description || "",
                rules: groupData.rules || "",
                coverImage: groupData.coverImage || "",
                logo: groupData.logo || "",
                isPublic: groupData.isPublic ?? true,
                memberApprovalRequired: groupData.memberApprovalRequired ?? false,
                postApprovalRequired: groupData.postApprovalRequired ?? false,
            })
        } catch (error) {
            console.error("Error fetching group info:", error)
        }
    }

    const fetchGroupMembers = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}/members?page=1&limit=50`)
            const membersData = data.data.members

            setMembers(membersData)

            // Filter members by role
            const generalGroupMembers = membersData.filter((member: Member) => member.role === "member")
            const adminGroupMembers = membersData.filter((member: Member) => member.role === "admin")
            const moderatorGroupMembers = membersData.filter((member: Member) => member.role === "moderator")

            setGeneralMembers(generalGroupMembers)
            setAdmins(adminGroupMembers)
            setModerators(moderatorGroupMembers)

            // Check current user's membership status and role
            const currentUserMember = membersData.find((member: Member) => member.userId === user?.userId)
            if (currentUserMember) {
                setMembershipStatus("joined")
                setUserRole(currentUserMember.role)

                // After setting user role, fetch additional data
                await Promise.all([
                    fetchGroupPosts(true), // Pass true to indicate user is a member
                    currentUserMember.role === "admin" || currentUserMember.role === "moderator"
                        ? (async () => {
                            await fetchJoinRequests();
                        })
                        : Promise.resolve(),
                ])
            } else {
                // Check if user has a pending request
                await checkUserJoinRequestStatus()
                // Fetch posts for non-members (only public posts)
                await fetchGroupPosts(false)
            }
        } catch (error) {
            console.error("Error fetching group members:", error)
        }
    }

    const checkUserJoinRequestStatus = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}/member-requests/status`)
            const userRequest = data.data.status;
            if (userRequest) {
                if (userRequest.status === "pending") {
                    setMembershipStatus("pending")
                } else {
                    setMembershipStatus("rejected")
                }
            }
        } catch (error) {
            console.error("Error checking join request status:", error)
        }
    }

    const fetchGroupPosts = async (isMemberParam?: boolean) => {
        try {
            const { data } = await api.get(`/posts?page=1&limit=50&groupId=${groupId}`)
            const allPosts = data.data.posts

            // Use the parameter if provided, otherwise use the state
            const memberStatus = isMemberParam !== undefined ? isMemberParam : isMember

            // Filter posts based on user membership and post visibility
            let visiblePosts = allPosts

            if (!memberStatus) {
                // Non-members can only see public approved posts
                visiblePosts = allPosts.filter((post: Post) => post.isPublic && post.status === "approved")
            } else {
                // Members can see all approved posts (both public and private)
                visiblePosts = allPosts.filter((post: Post) => post.status === "approved")
            }

            setPosts(visiblePosts)

        } catch (error) {
            console.error("Error fetching group posts:", error)
        }
    }

    const fetchJoinRequests = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}/member-requests?page=1&limit=50`)
            const pendingRequests = data.data.requests.filter((req: JoinRequest) => req.status === "pending")
            setJoinRequests(pendingRequests)
        } catch (error) {
            console.error("Error fetching join requests:", error)
        }
    }

    const handleJoinGroup = async () => {
        try {
            await api.post(`/groups/${groupId}/join`)

            if (group?.memberApprovalRequired) {
                setMembershipStatus("pending")
                toast.success("Join request sent! Waiting for approval.")
            } else {
                setMembershipStatus("joined")
                setUserRole("member")
                toast.success("Successfully joined the group!")
                await fetchGroupMembers()
                await fetchGroupInfo() // Refresh to update member count
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to join group")
        }
    }

    const handleCancelJoinRequest = async () => {
        try {
            await api.post(`/groups/${groupId}/leave`)
            setMembershipStatus("join")
            toast.success("Join request cancelled")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel request")
        }
    }

    const handleLeaveGroup = async () => {
        try {
            await api.post(`/groups/${groupId}/leave`)
            setMembershipStatus("join")
            setUserRole(null)
            toast.success("Successfully left the group")
            await fetchGroupMembers()
            await fetchGroupInfo() // Refresh to update member count
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to leave group")
        }
    }

    const handleApproveJoinRequest = async (requestId: string) => {
        try {
            await api.post(`/groups/${groupId}/member-requests/${requestId}/approve`)
            toast.success("Member request approved!")
            await fetchJoinRequests()
            await fetchGroupMembers()
            await fetchGroupInfo() // Refresh to update member count
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to approve request")
        }
    }

    const handleRejectJoinRequest = async (requestId: string, reason?: string) => {
        try {
            await api.post(`/groups/${groupId}/member-requests/${requestId}/reject`, {
                reason: reason || "No reason provided",
            })
            toast.success("Member request rejected")
            await fetchJoinRequests()
            setSelectedRequest(null)
            setRejectReason("")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject request")
        }
    }

    const handleEditGroup = async () => {
        try {
            await api.put(`/groups/${groupId}`, {
                name: editGroupData.name,
                description: editGroupData.description,
                rules: editGroupData.rules,
                coverImage: editGroupData.coverImage,
                logo: editGroupData.logo,
                isPublic: editGroupData.isPublic,
                memberApprovalRequired: editGroupData.memberApprovalRequired,
                postApprovalRequired: editGroupData.postApprovalRequired,
            })

            toast.success("Group updated successfully!")
            setShowEditGroupModal(false)
            await fetchGroupInfo()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update group")
        }
    }

    const getMembershipButton = () => {
        switch (membershipStatus) {
            case "join":
                return (
                    <Button onClick={handleJoinGroup} className="campus-gradient shadow-lg">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Group
                    </Button>
                )
            case "pending":
                return (
                    <Button
                        onClick={handleCancelJoinRequest}
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 bg-transparent hover:bg-yellow-50"
                    >
                        <Clock className="w-4 h-4 mr-2" />
                        Cancel Request
                    </Button>
                )
            case "joined":
                return (
                    <Button
                        onClick={handleLeaveGroup}
                        variant="outline"
                        className="hover:bg-red-50 hover:border-red-300 bg-transparent"
                    >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Leave Group
                    </Button>
                )
            case "rejected":
                return (
                    <Button disabled variant="outline" className="border-red-500 text-red-600 bg-transparent">
                        <X className="w-4 h-4 mr-2" />
                        Request Rejected
                    </Button>
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading group...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p>Group not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted">
            <TopHeader />

            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
            <div className="flex flex-1">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
                    <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-6">
                            {/* Group Cover and Info */}
                            <Card className="shadow-lg">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        {group.coverImage ? (
                                            <img
                                                src={group.coverImage || "/placeholder.svg"}
                                                alt={group.name}
                                                className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 md:h-64 campus-gradient rounded-t-lg flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <Users className="w-16 h-16 mx-auto mb-4 opacity-70" />
                                                    <span className="text-lg font-medium opacity-70">{group.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Group Logo */}
                                        {group.logo && (
                                            <div className="absolute bottom-4 left-4">
                                                <img
                                                    src={group.logo || "/placeholder.svg"}
                                                    alt={`${group.name} logo`}
                                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Privacy Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant={group.isPublic ? "default" : "secondary"} className="bg-black/50 text-white">
                                                {group.isPublic ? (
                                                    <>
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Public
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-3 h-3 mr-1" />
                                                        Private
                                                    </>
                                                )}
                                            </Badge>
                                        </div>

                                        {/* Group Actions Dropdown */}
                                        {isAdmin && (
                                        <div className="absolute top-4 right-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="bg-white/20 cursor-pointer hover:bg-white/30 text-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-md shadow-lg py-1">

                                                        <>
                                                            <DropdownMenuItem className="hover:bg-white/40 cursor-pointer"  onClick={() => setShowEditGroupModal(true)}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit Group
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="hover:bg-white/40 cursor-pointer" onClick={() => router.push(`/groups/${uuidToNumericString(groupId)}/pending/members`)}>
                                                                <UserPlus className="w-4 h-4 mr-2" />
                                                                Member Requests ({joinRequests.length})
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="hover:bg-white/40 cursor-pointer" onClick={() => router.push(`/groups/${uuidToNumericString(groupId)}/pending/posts`)}>
                                                                <MessageSquare className="w-4 h-4 mr-2" />
                                                                Pending Posts
                                                            </DropdownMenuItem>
                                                        </>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        )}
                                    </div>

                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                                            <div className="flex-1">
                                                <h1 className="text-xl md:text-3xl font-bold campus-gradient-text mb-2">{group.name}</h1>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                              {members.length} Members
                          </span>
                                                    {group.memberApprovalRequired && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <UserCheck className="w-3 h-3 mr-1" />
                                                            Approval Required
                                                        </Badge>
                                                    )}
                                                    {group.postApprovalRequired && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Moderated Posts
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {canManageGroup && (
                                                    <Button
                                                        variant={adminView ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setAdminView(!adminView)}
                                                        className={adminView ? "campus-gradient" : ""}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        {adminView ? "General View" : "Admin View"}
                                                    </Button>
                                                )}
                                                {getMembershipButton()}
                                            </div>
                                        </div>

                                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="posts" className="text-xs sm:text-sm">
                                                    Posts
                                                </TabsTrigger>
                                                <TabsTrigger value="pinned" className="text-xs sm:text-sm">
                                                    Pinned
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Post Creation - Only for joined members */}
                            {isMember && membershipStatus === "joined" && (
                                <Card className="rounded-lg shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src="/placeholder-user.jpg" />
                                                <AvatarFallback className="bg-gray-200">{`${user.firstName[0]}${user.lastName[0]}`}</AvatarFallback>
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
                                                    onClick={() =>
                                                        setIsCreatePostOpen(true)
                                                    }
                                                >
                                                    <Image className="w-5 h-5" />
                                                    <span className="hidden sm:inline text-sm">
                                            Photo
                                        </span>
                                                </button>
                                                <button
                                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                    onClick={() =>
                                                        setIsCreatePostOpen(true)
                                                    }
                                                >
                                                    <CalendarDays className="w-5 h-5" />
                                                    <span className="hidden sm:inline text-sm">
                                            Event
                                        </span>
                                                </button>
                                                <button
                                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                    onClick={() =>
                                                        setIsCreatePostOpen(true)
                                                    }
                                                >
                                                    <ListChecks className="w-5 h-5" />
                                                    <span className="hidden sm:inline text-sm">
                                            Poll
                                        </span>
                                                </button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="text-purple-600 hover:text-purple-800 font-medium"
                                                onClick={() => setIsCreatePostOpen(true)}
                                            >
                                                <Plus className="w-5 h-5 mr-2" />
                                                <span className="hidden sm:inline">
                                        Create Post
                                    </span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Feed Posts */}
                            <div className="space-y-4">
                                {posts.length === 0 ? (
                                    <Card className="shadow-lg">
                                        <CardContent className="p-8 text-center">
                                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                                            <p className="text-muted-foreground">
                                                {isMember ? "Be the first to share something!" : "Join the group to see posts"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    posts.map((post) => <FeedPost key={post.id} post={post} />)
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4 md:space-y-6">
                            {/* About this group */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-primary" />
                                        About this group
                                    </h3>
                                    <div className="space-y-4">
                                        {group.description && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Description</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
                                            </div>
                                        )}
                                        {group.rules && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Rules</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{group.rules}</p>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Created</h4>
                                            <p className="text-sm text-muted-foreground">{new Date(group.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Admin Actions */}
                            {canManageGroup && adminView && (
                                <>
                                    {/* Pending Join Requests */}
                                    {joinRequests.length > 0 && (
                                        <Card className="shadow-lg">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-primary" />
                            Join Requests
                          </span>
                                                    <Badge variant="secondary" className="campus-gradient text-white">
                                                        {joinRequests.length}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {joinRequests.slice(0, 3).map((request) => (
                                                    <div
                                                        key={request.requestId}
                                                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-8 h-8">
                                                                <AvatarImage src={request.profilePicture || "/placeholder.svg"} />
                                                                <AvatarFallback className="campus-gradient text-white text-xs">
                                                                    {request.firstName[0]}
                                                                    {request.lastName[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-sm">
                                                                    {request.firstName} {request.lastName}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">{request.universityName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproveJoinRequest(request.requestId)}
                                                                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => setSelectedRequest(request)}
                                                                className="h-8 w-8 p-0 border-red-300 hover:bg-red-50"
                                                            >
                                                                <X className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {joinRequests.length > 3 && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full bg-transparent"
                                                        onClick={() => router.push(`/groups/${groupId}/pending/members`)}
                                                    >
                                                        View All ({joinRequests.length})
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Pending Posts */}
                                    {pendingPosts.length > 0 && (
                                        <Card className="shadow-lg">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Pending Posts
                          </span>
                                                    <Badge variant="secondary" className="campus-gradient text-white">
                                                        {pendingPosts.length}
                                                    </Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full bg-transparent"
                                                    onClick={() => router.push(`/groups/${groupId}/pending/posts`)}
                                                >
                                                    Review Posts ({pendingPosts.length})
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </>
                            )}

                            {/* Admins */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Crown className="w-4 h-4 text-yellow-500" />
                                            Admins ({admins.length})
                                        </h3>
                                        {admins.length > 2 && (
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-primary flex items-center text-sm"
                                                onClick={() => setShowAllAdmins(!showAllAdmins)}
                                            >
                                                {showAllAdmins ? "Show Less" : "Show All"}
                                                {showAllAdmins ? (
                                                    <ChevronUp className="w-4 h-4 ml-1" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 ml-1" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        {(showAllAdmins ? admins : admins.slice(0, 2)).map((admin) => (
                                            <div
                                                key={admin.memberId}
                                                className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                                                onClick={() => router.push(`/profile/${admin.userId}`)}
                                            >
                                                <Avatar className="w-8 h-8 md:w-10 md:h-10">
                                                    <AvatarImage src={admin.profilePicture || "/placeholder.svg"} />
                                                    <AvatarFallback className="campus-gradient text-white">
                                                        {admin.firstName[0]}
                                                        {admin.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">
                                                        {admin.firstName} {admin.lastName}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">{admin.universityName}</p>
                                                    <Badge variant="outline" className="text-xs mt-1 border-yellow-500 text-yellow-600">
                                                        ADMIN
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Members */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            Members ({generalMembers.length})
                                        </h3>
                                        {generalMembers.length > 2 && (
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto text-primary flex items-center text-sm"
                                                onClick={() => setShowAllMembers(!showAllMembers)}
                                            >
                                                {showAllMembers ? "Show Less" : "Show All"}
                                                {showAllMembers ? (
                                                    <ChevronUp className="w-4 h-4 ml-1" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 ml-1" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-3 md:space-y-4">
                                        {(showAllMembers ? generalMembers : generalMembers.slice(0, 3)).map((member) => (
                                            <div
                                                key={member.memberId}
                                                className="flex items-center space-x-2 md:space-x-3 cursor-pointer hover:bg-muted/50 p-1 md:p-2 rounded"
                                                onClick={() => router.push(`/profile/${member.userId}`)}
                                            >
                                                <Avatar className="w-8 h-8 md:w-10 md:h-10">
                                                    <AvatarImage src={member.profilePicture || "/placeholder.svg"} />
                                                    <AvatarFallback className="campus-gradient text-white">
                                                        {member.firstName[0]}
                                                        {member.lastName[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">
                                                        {member.firstName} {member.lastName}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">{member.universityName}</p>
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        MEMBER
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Group Stats */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="font-semibold mb-4">Group Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Total Members</span>
                                            <span className="font-medium campus-gradient-text">{members.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Posts</span>
                                            <span className="font-medium campus-gradient-text">{posts.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Admins</span>
                                            <span className="font-medium campus-gradient-text">{admins.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Created</span>
                                            <span className="text-sm">{new Date(group.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <CreatePostModal open={createPostOpen} onOpenChange={setCreatePostOpen} />

            {/* Edit Group Modal */}
            <Dialog open={showEditGroupModal} onOpenChange={setShowEditGroupModal}>
                <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Group</DialogTitle>
                        <DialogDescription>Update your group information and settings.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <Label>Cover Image</Label>
                                <div className="mt-2">
                                    {editGroupData.coverImage ? (
                                        <div className="relative">
                                            <img
                                                src={editGroupData.coverImage || "/placeholder.svg"}
                                                alt="Cover preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2 bg-transparent"
                                                onClick={() => setEditGroupData({ ...editGroupData, coverImage: "" })}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                                                <p className="text-sm text-muted-foreground">No cover image</p>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={coverPhotoRef}
                                        onChange={handleCoverPhotoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 bg-transparent"
                                        onClick={() => coverPhotoRef.current?.click()}
                                        disabled={isUploadingCover}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isUploadingCover ? "Uploading..." : "Upload Cover Image"}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label>Group Logo</Label>
                                <div className="mt-2">
                                    {editGroupData.logo ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={editGroupData.logo || "/placeholder.svg"}
                                                alt="Logo preview"
                                                className="w-20 h-20 object-cover rounded-full border-2 border-muted"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-transparent"
                                                onClick={() => setEditGroupData({ ...editGroupData, logo: "" })}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-full flex items-center justify-center">
                                            <Users className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={profilePhotoRef}
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 ml-4 bg-transparent"
                                        onClick={() => profilePhotoRef.current?.click()}
                                        disabled={isUploadingLogo}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="groupName">Group Name</Label>
                                <Input
                                    id="groupName"
                                    value={editGroupData.name}
                                    onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
                                    placeholder="Enter group name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="groupDescription">Description</Label>
                                <Textarea
                                    id="groupDescription"
                                    value={editGroupData.description}
                                    onChange={(e) => setEditGroupData({ ...editGroupData, description: e.target.value })}
                                    placeholder="Describe your group"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="groupRules">Rules</Label>
                                <Textarea
                                    id="groupRules"
                                    value={editGroupData.rules}
                                    onChange={(e) => setEditGroupData({ ...editGroupData, rules: e.target.value })}
                                    placeholder="Set group rules"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="isPublic">Public Group</Label>
                                    <p className="text-sm text-muted-foreground">Anyone can see and join this group</p>
                                </div>
                                <Switch
                                    id="isPublic"
                                    checked={editGroupData.isPublic}
                                    onCheckedChange={(checked) => setEditGroupData({ ...editGroupData, isPublic: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="memberApproval">Member Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Admins must approve new members</p>
                                </div>
                                <Switch
                                    id="memberApproval"
                                    checked={editGroupData.memberApprovalRequired}
                                    onCheckedChange={(checked) => setEditGroupData({ ...editGroupData, memberApprovalRequired: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="postApproval">Post Approval Required</Label>
                                    <p className="text-sm text-muted-foreground">Admins must approve posts before they're visible</p>
                                </div>
                                <Switch
                                    id="postApproval"
                                    checked={editGroupData.postApprovalRequired}
                                    onCheckedChange={(checked) => setEditGroupData({ ...editGroupData, postApprovalRequired: checked })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditGroupModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditGroup} className="campus-gradient">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Join Request Rejection Modal */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Reject Join Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject {selectedRequest?.firstName} {selectedRequest?.lastName}'s request to join
                            this group?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reason">Reason (optional)</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedRequest && handleRejectJoinRequest(selectedRequest.requestId, rejectReason)}
                        >
                            Reject Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Post Modal */}
            <CreatePostModal
                open={isCreatePostOpen}
                onOpenChange={setIsCreatePostOpen}
            />
        </div>
        </div>
    )
}

export default SingleGroup
