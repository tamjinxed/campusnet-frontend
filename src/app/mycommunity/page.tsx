"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import {
    MessageSquare,
    MoreHorizontal,
    ImageIcon,
    Users,
    Shield,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Crown,
    Edit,
    Settings,
    Upload,
    CalendarDays,
    ListChecks,
    Plus,
    X,
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
import { toast } from "react-hot-toast"
import { supabaseAdmin } from "@/app/lib/supabase"

// Define interfaces
interface Community {
    id: string
    name: string
    description: string
    rules: string
    memberCount: number
    coverPhotoUrl: string
    logoUrl: string
    isPublic: boolean
    postApproval: boolean
    createdAt: string
    universityId: string
}

interface Member {
    userId: string
    communityId: string
    role: "admin" | "member" | "moderator"
    joinedAt: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePicture: string
    bio: string
    department: string
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

const MyCommunity = () => {
    const { user } = useAuth()
    const router = useRouter()

    // State management
    const [community, setCommunity] = useState<Community | null>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [generalMembers, setGeneralMembers] = useState<Member[]>([])
    const [admins, setAdmins] = useState<Member[]>([])
    const [moderators, setModerators] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [pendingPosts, setPendingPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<"admin" | "member" | "moderator" | null>(null)

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
    const [showEditCommunityModal, setShowEditCommunityModal] = useState(false)

    // Edit community state
    const [editCommunityData, setEditCommunityData] = useState({
        name: "",
        description: "",
        rules: "",
        coverImage: "",
        logo: "",
        isPublic: true,
        postApproval: false,
    })

    // Check user permissions based on actual role
    const isAdmin = userRole === "admin"
    const isModerator = userRole === "moderator" || userRole === "admin"
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
                setEditCommunityData({ ...editCommunityData, coverImage: imageUrl })
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
                setEditCommunityData({ ...editCommunityData, logo: imageUrl })
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
    }, [user])

    const fetchAllData = async () => {
        try {
            setLoading(true)
            await fetchCommunityInfo()
            // Wait for community to be set, then fetch other data
            setTimeout(async () => {
                await Promise.all([fetchCommunityMembers(), fetchCommunityPosts()])
            }, 100)
        } catch (error) {
            console.error("Error fetching community data:", error)
            toast.error("Failed to load community data")
        } finally {
            setLoading(false)
        }
    }

    const fetchCommunityInfo = async () => {
        try {
            const { data } = await api.get(`/communities/my`)
            const communityData = data.data.communities
            setCommunity(communityData)

            // Set edit form data
            setEditCommunityData({
                name: communityData.name || "",
                description: communityData.description || "",
                rules: communityData.rules || "",
                coverImage: communityData.coverPhotoUrl || "",
                logo: communityData.logoUrl || "",
                isPublic: communityData.isPublic ?? true,
                postApproval: communityData.postApproval ?? false,
            })
        } catch (error) {
            console.error("Error fetching community info:", error)
        }
    }

    const fetchCommunityMembers = async () => {
        if (!community?.id) return

        try {
            const { data } = await api.get(`/communities/${community.id}/members?page=1&limit=50`)
            const membersData = data.data.members

            setMembers(membersData)

            // Filter members by role
            const generalCommunityMembers = membersData.filter((member: Member) => member.role === "member")
            const adminCommunityMembers = membersData.filter((member: Member) => member.role === "admin")
            const moderatorCommunityMembers = membersData.filter((member: Member) => member.role === "moderator")

            setGeneralMembers(generalCommunityMembers)
            setAdmins(adminCommunityMembers)
            setModerators(moderatorCommunityMembers)

            // Check current user's role in the community
            const currentUserMember = membersData.find((member: Member) => member.userId === user?.userId)
            if (currentUserMember) {
                setUserRole(currentUserMember.role)
            }
        } catch (error) {
            console.error("Error fetching community members:", error)
        }
    }

    const fetchCommunityPosts = async () => {
        if (!community?.id) return

        try {
            const { data } = await api.get(`/posts?page=1&limit=50&communityId=${community.id}`)
            const allPosts = data.data.posts

            // All community members can see approved posts
            const visiblePosts = allPosts.filter((post: Post) => post.status === "approved")
            setPosts(visiblePosts)

            // Only admins and moderators can see pending posts
            if (userRole === "admin" || userRole === "moderator") {
                const pendingPostsData = allPosts.filter((post: Post) => post.status === "pending")
                setPendingPosts(pendingPostsData)
            }
        } catch (error) {
            console.error("Error fetching community posts:", error)
        }
    }

    const handleEditCommunity = async () => {
        if (!community?.id) return

        try {
            await api.put(`/communities/${community.id}`, {
                name: editCommunityData.name,
                description: editCommunityData.description,
                rules: editCommunityData.rules,
                coverImage: editCommunityData.coverImage,
                logo: editCommunityData.logo,
                isPublic: editCommunityData.isPublic,
                postApproval: editCommunityData.postApproval,
            })

            toast.success("Community updated successfully!")
            setShowEditCommunityModal(false)
            await fetchCommunityInfo()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update community")
        }
    }

    useEffect(() => {
        if (community?.id) {
            fetchCommunityMembers()
        }
    }, [community?.id])

    useEffect(() => {
        if (community?.id && userRole) {
            fetchCommunityPosts()
        }
    }, [community?.id, userRole])

    if (loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading community...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!community) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">No Community Found</h2>
                        <p className="text-muted-foreground mb-4">You don't have a community yet.</p>
                        <Button onClick={() => router.push("/communities/create")} className="campus-gradient">
                            Create Community
                        </Button>
                    </div>
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
                            {/* Community Cover and Info */}
                            <Card className="shadow-lg">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        {community.coverPhotoUrl ? (
                                            <img
                                                src={community.coverPhotoUrl || "/placeholder.svg"}
                                                alt={community.name}
                                                className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 md:h-64 campus-gradient rounded-t-lg flex items-center justify-center">
                                                <div className="text-center text-white">
                                                    <Users className="w-16 h-16 mx-auto mb-4 opacity-70" />
                                                    <span className="text-lg font-medium opacity-70">{community.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Community Logo */}
                                        {community.logoUrl && (
                                            <div className="absolute bottom-4 left-4">
                                                <img
                                                    src={community.logoUrl || "/placeholder.svg"}
                                                    alt={`${community.name} logo`}
                                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                                />
                                            </div>
                                        )}

                                        {/* Privacy Badge */}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant={community.isPublic ? "default" : "secondary"} className="bg-black/50 text-white">
                                                {community.isPublic ? (
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

                                        {/* Community Actions Dropdown - Only for Admins */}
                                        {isAdmin && (
                                            <div className="absolute top-4 right-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-white/80 backdrop-blur-sm">
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-white/50" onClick={() => setShowEditCommunityModal(true)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Community
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-white/50" onClick={() => router.push(`/mycommunity/pending/posts`)}>
                                                            <MessageSquare className="w-4 h-4 mr-2" />
                                                            Pending Posts ({pendingPosts.length})
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                                            <div className="flex-1">
                                                <h1 className="text-xl md:text-3xl font-bold campus-gradient-text mb-2">{community.name}</h1>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                              {community.memberCount} Members
                          </span>
                                                    {community.postApproval && (
                                                        <Badge variant="outline" className="text-xs">
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            Moderated Posts
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="text-xs">
                                                        {userRole?.toUpperCase()}
                                                    </Badge>
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

                            {/* Post Creation */}
                            <Card className="rounded-lg shadow-sm">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                                            <AvatarFallback className="bg-gray-200">
                                                {user?.firstName?.[0]}
                                                {user?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Input
                                            placeholder="What's on your mind..."
                                            className="flex-1 bg-gray-50 border-0 cursor-pointer"
                                            onClick={() => setCreatePostOpen(true)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                        <div className="flex space-x-4">
                                            <button
                                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                onClick={() => setCreatePostOpen(true)}
                                            >
                                                <ImageIcon className="w-5 h-5" />
                                                <span className="hidden sm:inline text-sm">Photo</span>
                                            </button>
                                            <button
                                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                onClick={() => setCreatePostOpen(true)}
                                            >
                                                <CalendarDays className="w-5 h-5" />
                                                <span className="hidden sm:inline text-sm">Event</span>
                                            </button>
                                            <button
                                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                                                onClick={() => setCreatePostOpen(true)}
                                            >
                                                <ListChecks className="w-5 h-5" />
                                                <span className="hidden sm:inline text-sm">Poll</span>
                                            </button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="text-purple-600 hover:text-purple-800 font-medium"
                                            onClick={() => setCreatePostOpen(true)}
                                        >
                                            <Plus className="w-5 h-5 mr-2" />
                                            <span className="hidden sm:inline">Create Post</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Feed Posts */}
                            <div className="space-y-4">
                                {posts.length === 0 ? (
                                    <Card className="shadow-lg">
                                        <CardContent className="p-8 text-center">
                                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                                            <p className="text-muted-foreground">Be the first to share something with your community!</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    posts.map((post) => <FeedPost key={post.id} post={post} />)
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4 md:space-y-6">
                            {/* About this community */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-primary" />
                                        About this community
                                    </h3>
                                    <div className="space-y-4">
                                        {community.description && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Description</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
                                            </div>
                                        )}
                                        {community.rules && (
                                            <div>
                                                <h4 className="font-medium text-sm mb-2">Rules</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{community.rules}</p>
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Created</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(community.createdAt).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Admin Actions - Only for Admins and Moderators */}
                            {canManageGroup && adminView && (
                                <>
                                    {/* Pending Posts - Only for Admins and Moderators */}
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
                                                    onClick={() => router.push(`/mycommunity/pending/posts`)}
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
                                                key={admin.userId}
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
                                                    <p className="text-xs text-muted-foreground">{admin.department}</p>
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
                                                key={member.userId}
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
                                                    <p className="text-xs text-muted-foreground">{member.department}</p>
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        MEMBER
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Community Stats */}
                            <Card className="shadow-lg">
                                <CardContent className="p-4 md:p-6">
                                    <h3 className="font-semibold mb-4">Community Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Total Members</span>
                                            <span className="font-medium campus-gradient-text">{community.memberCount}</span>
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
                                            <span className="text-sm">
                        {new Date(community.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                      </span>
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

            {/* Edit Community Modal - Only for Admins */}
            {isAdmin && (
                <Dialog open={showEditCommunityModal} onOpenChange={setShowEditCommunityModal}>
                    <DialogContent className="max-w-2xl bg-white max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Community</DialogTitle>
                            <DialogDescription>Update your community information and settings.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* Image Upload Section */}
                            <div className="space-y-4">
                                <div>
                                    <Label>Cover Image</Label>
                                    <div className="mt-2">
                                        {editCommunityData.coverImage ? (
                                            <div className="relative">
                                                <img
                                                    src={editCommunityData.coverImage || "/placeholder.svg"}
                                                    alt="Cover preview"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2 bg-transparent"
                                                    onClick={() => setEditCommunityData({ ...editCommunityData, coverImage: "" })}
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
                                    <Label>Community Logo</Label>
                                    <div className="mt-2">
                                        {editCommunityData.logo ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={editCommunityData.logo || "/placeholder.svg"}
                                                    alt="Logo preview"
                                                    className="w-20 h-20 object-cover rounded-full border-2 border-muted"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-transparent"
                                                    onClick={() => setEditCommunityData({ ...editCommunityData, logo: "" })}
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
                                    <Label htmlFor="communityName">Community Name</Label>
                                    <Input
                                        id="communityName"
                                        value={editCommunityData.name}
                                        onChange={(e) => setEditCommunityData({ ...editCommunityData, name: e.target.value })}
                                        placeholder="Enter community name"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="communityDescription">Description</Label>
                                    <Textarea
                                        id="communityDescription"
                                        value={editCommunityData.description}
                                        onChange={(e) => setEditCommunityData({ ...editCommunityData, description: e.target.value })}
                                        placeholder="Describe your community"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="communityRules">Rules</Label>
                                    <Textarea
                                        id="communityRules"
                                        value={editCommunityData.rules}
                                        onChange={(e) => setEditCommunityData({ ...editCommunityData, rules: e.target.value })}
                                        placeholder="Set community rules"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="isPublic">Public Community</Label>
                                        <p className="text-sm text-muted-foreground">Anyone can see and join this community</p>
                                    </div>
                                    <Switch
                                        id="isPublic"
                                        checked={editCommunityData.isPublic}
                                        onCheckedChange={(checked) => setEditCommunityData({ ...editCommunityData, isPublic: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="postApproval">Post Approval Required</Label>
                                        <p className="text-sm text-muted-foreground">Admins must approve posts before they're visible</p>
                                    </div>
                                    <Switch
                                        id="postApproval"
                                        checked={editCommunityData.postApproval}
                                        onCheckedChange={(checked) => setEditCommunityData({ ...editCommunityData, postApproval: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowEditCommunityModal(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditCommunity} className="campus-gradient">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
        </div>
    )
}

export default MyCommunity;
