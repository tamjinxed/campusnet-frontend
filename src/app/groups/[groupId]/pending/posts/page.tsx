"use client"

import React, { useEffect, useState } from "react"
import { ArrowLeft, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
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

import { TopHeader } from "@/app/components/layout/topheader"
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar"
import api from "@/app/lib/axios"
import { useAuth } from "@/app/context/AuthContext"
import {numericStringToUuid, uuidToNumericString} from "@/app/utils/utils"
import { toast } from "react-hot-toast"
import timeAgoSocialMedia from "@/app/utils/timeCalc";

interface Post {
    id: number
    content: string
    images?: string[]
    authorFirstName: string
    authorLastName: string
    authorProfilePicture: string
    authorUniversity: string
    authorUniversityCountry: string
    created_at: string
    reactions: any[]
    reactionCount: number
    commentCount: number
    comments: any[]
    isPinned?: boolean
    isPublic: boolean
    status: "pending" | "approved" | "rejected"
}

interface Group {
    id: string
    name: string
    description: string
}

const PendingPosts = ({ params }: { params: Promise<{ groupId: string }> }) => {
    let { groupId } = React.use(params)
    groupId = numericStringToUuid(groupId)
    const { user } = useAuth()
    const router = useRouter()

    const [group, setGroup] = useState<Group | null>(null)
    const [pendingPosts, setPendingPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user, groupId])

    const fetchData = async () => {
        try {
            setLoading(true)
            await Promise.all([fetchGroupInfo(), fetchPendingPosts()])
        } catch (error) {
            console.error("Error fetching data:", error)
            toast.error("Failed to load data")
        } finally {
            setLoading(false)
        }
    }

    const fetchGroupInfo = async () => {
        try {
            const { data } = await api.get(`/groups/${groupId}`)
            setGroup(data.data.group)
        } catch (error) {
            console.error("Error fetching group info:", error)
        }
    }

    const fetchPendingPosts = async () => {
        try {
            const { data } = await api.get(`/posts?page=1&limit=50&groupId=${groupId}&status=pending`);
            const allPosts = data.data.posts
            setPendingPosts(allPosts)
        } catch (error) {
            console.error("Error fetching pending posts:", error)
        }
    }

    const handleApprove = async (postId: number) => {
        try {
            await api.post(`/posts/${postId}/approve`)
            toast.success("Post approved!")
            await fetchPendingPosts()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to approve post")
        }
    }

    const handleReject = async (postId: number, reason?: string) => {
        try {
            await api.post(`/posts/${postId}/reject`, {
                reason: reason || "No reason provided",
            })
            toast.success("Post rejected")
            await fetchPendingPosts()
            setSelectedPost(null)
            setRejectReason("")
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to reject post")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted">
            <TopHeader />

            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center mb-6">
                            <Button variant="ghost" size="icon" className="mr-4" onClick={() => router.push(`/groups/${uuidToNumericString(groupId)}`)}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold campus-gradient-text">Pending Posts</h1>
                                <p className="text-muted-foreground">Review and approve posts for {group?.name || "this group"}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {pendingPosts.length === 0 ? (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                                <Check className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">No pending posts</h3>
                                            <p className="text-muted-foreground">All posts have been reviewed.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                pendingPosts.map((post) => (
                                    <Card key={post.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage src={post.authorProfilePicture || "/placeholder.svg"} />
                                                        <AvatarFallback className="campus-gradient text-white">
                                                            {post.authorFirstName[0]}
                                                            {post.authorLastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {post.authorFirstName} {post.authorLastName}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">{post.authorUniversity}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {timeAgoSocialMedia(new Date(post["created_at"]))}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary">Pending</Badge>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-foreground mb-4">{post.content}</p>

                                                {post.images && post.images.length > 0 && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {post.images.map((image, index) => (
                                                            <img
                                                                key={index}
                                                                src={image || "/placeholder.svg"}
                                                                alt="Post content"
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                        ))}
                                                    </div>
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
                                                        onClick={() => setSelectedPost(post)}
                                                        className="border-red-300 hover:bg-red-50"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <Badge variant={post.isPublic ? "default" : "secondary"}>
                                                        {post.isPublic ? "Public" : "Private"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Rejection Modal */}
            <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Reject Post</DialogTitle>
                        <DialogDescription>Are you sure you want to reject this post?</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="postReason">Reason (optional)</Label>
                            <Textarea
                                id="postReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Provide a reason for rejection..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedPost(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => selectedPost && handleReject(selectedPost.id, rejectReason)}>
                            Reject Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PendingPosts
