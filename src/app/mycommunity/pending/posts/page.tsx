"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Check, X, Eye, MessageSquare, Heart, MoreHorizontal, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog"
import { Separator } from "@/app/components/ui/separator"

import { TopHeader } from "@/app/components/layout/topheader"
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar"
import api from "@/app/lib/axios"
import { useAuth } from "@/app/context/AuthContext"
import timeCalc from "@/app/utils/timeCalc"
import { toast } from "react-hot-toast"

interface Post {
    id: number
    content: string
    images?: string[]
    authorFirstName: string
    authorLastName: string
    authorProfilePicture: string
    authorUniversity: string
    authorUniversityCountry: string
    createdAt: string
    reactions: any[]
    reactionCount: number
    commentCount: number
    comments: any[]
    isPinned?: boolean
    isPublic: boolean
    status: "pending" | "approved" | "rejected"
    authorId: string
}

interface Community {
    id: string
    name: string
    description: string
    logoUrl: string
    coverPhotoUrl: string
    memberCount: number
}

interface Member {
    userId: string
    communityId: string
    role: "admin" | "member" | "moderator"
    joinedAt: string
}

const PendingPosts = () => {
    const { user } = useAuth()
    const router = useRouter()

    // State management
    const [community, setCommunity] = useState<Community | null>(null)
    const [pendingPosts, setPendingPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [processingPostId, setProcessingPostId] = useState<number | null>(null)
    const [userRole, setUserRole] = useState<"admin" | "member" | "moderator" | null>(null)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        if (user) {
            checkAccessAndFetchData()
        }
    }, [user])

    const checkAccessAndFetchData = async () => {
        try {
            setLoading(true)

            // First get community info and check user role
            const { data: communityData } = await api.get(`/communities/my`)
            const communityInfo = communityData.data.communities
            setCommunity(communityInfo)

            if (communityInfo?.id) {
                // Check user's role in the community
                const { data: membersData } = await api.get(`/communities/${communityInfo.id}/members?page=1&limit=50`)
                const members = membersData.data.members
                const currentUserMember = members.find((member: Member) => member.userId === user?.userId)

                if (currentUserMember) {
                    setUserRole(currentUserMember.role)

                    // Only admins and moderators can access pending posts
                    if (currentUserMember.role === "admin" || currentUserMember.role === "moderator") {
                        setHasAccess(true)
                        await fetchPendingPosts(communityInfo.id)
                    } else {
                        setHasAccess(false)
                        toast.error("You don't have permission to view pending posts")
                    }
                } else {
                    setHasAccess(false)
                    toast.error("You are not a member of this community")
                }
            }
        } catch (error) {
            console.error("Error checking access:", error)
            toast.error("Failed to load pending posts")
            setHasAccess(false)
        } finally {
            setLoading(false)
        }
    }

    const fetchPendingPosts = async (communityId: string) => {
        try {
            const { data } = await api.get(`/posts?page=1&limit=50&communityId=${communityId}`)
            const allPosts = data.data.posts
            const pending = allPosts.filter((post: Post) => post.status === "pending")
            setPendingPosts(pending)
        } catch (error) {
            console.error("Error fetching pending posts:", error)
            toast.error("Failed to load pending posts")
        }
    }

    const handleApprovePost = async (postId: number) => {
        try {
            setProcessingPostId(postId)
            await api.post(`/posts/${postId}/approve`)
            toast.success("Post approved successfully!")
            if (community?.id) {
                await fetchPendingPosts(community.id)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to approve post")
        } finally {
            setProcessingPostId(null)
        }
    }

    const handleRejectPost = async (postId: number, reason?: string) => {
        try {
            setProcessingPostId(postId)
            await api.post(`/posts/${postId}/reject`, {
                reason: reason || "No reason provided",
            })
            toast.success("Post rejected")
            if (community?.id) {
                await fetchPendingPosts(community.id)
            }
            setShowRejectModal(false)
            setSelectedPost(null)
            setRejectReason("")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject post")
        } finally {
            setProcessingPostId(null)
        }
    }

    const openRejectModal = (post: Post) => {
        setSelectedPost(post)
        setShowRejectModal(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading pending posts...</p>
                    </div>
                </div>
            </div>
        )
    }

    // If user doesn't have access, show access denied
    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex">
                    <div className="hidden md:block">
                        <LeftSidebar />
                    </div>
                    <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-6">
                                <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-muted">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </div>
                            <Card className="shadow-lg">
                                <CardContent className="p-8 text-center">
                                    <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
                                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                                    <p className="text-muted-foreground mb-4">
                                        You don't have permission to view pending posts. Only community admins and moderators can access
                                        this page.
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Your role: <Badge variant="outline">{userRole?.toUpperCase() || "UNKNOWN"}</Badge>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            <TopHeader />

            <div className="flex flex-1">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <Button variant="ghost" size="sm" onClick={() => router.back()} className="hover:bg-muted">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <div className="flex items-center gap-3">
                                {community?.logoUrl && (
                                    <img
                                        src={community.logoUrl || "/placeholder.svg"}
                                        alt={community.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <h1 className="text-2xl font-bold campus-gradient-text">Pending Posts</h1>
                                    <p className="text-muted-foreground">
                                        {community?.name} • {pendingPosts.length} pending posts • Your role:{" "}
                                        <Badge variant="outline" className="ml-1">
                                            {userRole?.toUpperCase()}
                                        </Badge>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Posts */}
                        <div className="space-y-6">
                            {pendingPosts.length === 0 ? (
                                <Card className="shadow-lg">
                                    <CardContent className="p-8 text-center">
                                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                        <h3 className="text-lg font-semibold mb-2">No pending posts</h3>
                                        <p className="text-muted-foreground">
                                            All posts have been reviewed. New posts will appear here for approval.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                pendingPosts.map((post) => (
                                    <Card key={post.id} className="shadow-lg">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarImage src={post.authorProfilePicture || "/placeholder.svg"} />
                                                        <AvatarFallback className="campus-gradient text-white">
                                                            {post.authorFirstName?.[0]}
                                                            {post.authorLastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {post.authorFirstName} {post.authorLastName}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {post.authorUniversity}, {post.authorUniversityCountry}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                Pending Review
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{timeCalc(post.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Post Content */}
                                            <div>
                                                <p className="text-gray-800 leading-relaxed">{post.content}</p>
                                            </div>

                                            {/* Post Images */}
                                            {post.images && post.images.length > 0 && (
                                                <div className="rounded-lg overflow-hidden border">
                                                    {post.images.length === 1 ? (
                                                        <img
                                                            src={post.images[0] || "/placeholder.svg"}
                                                            alt="Post image"
                                                            className="w-full max-h-96 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-1">
                                                            {post.images.slice(0, 4).map((image, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={image || "/placeholder.svg"}
                                                                        alt={`Post image ${index + 1}`}
                                                                        className="w-full h-48 object-cover"
                                                                    />
                                                                    {index === 3 && post.images!.length > 4 && (
                                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                                            <span className="text-white font-semibold">+{post.images!.length - 4} more</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Post Metadata */}
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    {post.isPublic ? "Public" : "Members Only"}
                                                </div>
                                                {post.reactionCount > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4" />
                                                        {post.reactionCount} reactions
                                                    </div>
                                                )}
                                                {post.commentCount > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="w-4 h-4" />
                                                        {post.commentCount} comments
                                                    </div>
                                                )}
                                            </div>

                                            <Separator />

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => handleApprovePost(post.id)}
                                                        disabled={processingPostId === post.id}
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                    >
                                                        <Check className="w-4 h-4 mr-2" />
                                                        {processingPostId === post.id ? "Approving..." : "Approve"}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => openRejectModal(post)}
                                                        disabled={processingPostId === post.id}
                                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                                <div className="text-xs text-muted-foreground">Post ID: {post.id}</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Reject Post Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Reject Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this post by {selectedPost?.authorFirstName}{" "}
                            {selectedPost?.authorLastName}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reason">Reason for rejection (optional)</Label>
                            <Textarea
                                id="reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedPost && handleRejectPost(selectedPost.id, rejectReason)}
                            disabled={processingPostId === selectedPost?.id}
                        >
                            {processingPostId === selectedPost?.id ? "Rejecting..." : "Reject Post"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PendingPosts
