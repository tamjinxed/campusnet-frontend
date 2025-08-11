"use client"

import { Heart, MessageSquare, Share, MoreHorizontal, Pin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Textarea } from "@/app/components/ui/textarea"
import timeCalc from "@/app/utils/timeCalc"
import { useAuth } from "@/app/context/AuthContext"
import { useEffect, useMemo, useRef, useState } from "react"
import api from "@/app/lib/axios"

const FeedPost = ({ post, onPostUpdate }) => {
    const { user } = useAuth()

    // State for reaction, like and isLiking animation
    const [reactions, setReactions] = useState(post.reactions || [])
    const [reactionCount, setReactionCount] = useState(post.reactionCount || 0)
    const [userReaction, setUserReaction] = useState(null)
    const [isLiking, setIsLiking] = useState(false)

    // Find the initial reaction based on props
    const initialUserReaction = useMemo(() => {
        if (!user?.userId || !post.reactions?.length) return null
        return post.reactions.find((reaction) => reaction.userId === user.userId) || null
    }, [post.reactions, user?.userId])

    const [isReacted, setIsReacted] = useState(!!initialUserReaction)

    // Derive userReaction and isLiked from reactions and user
    useEffect(() => {
        if (!user?.userId || !reactions?.length) {
            setUserReaction(null)
            return
        }
        const findReaction = reactions.find((reaction) => reaction.userId === user.userId) || null
        setUserReaction(findReaction)
        setIsReacted(!!findReaction)
    }, [reactions, user?.userId])

    // Comment modal state
    const [commentCount, setCommentCount] = useState(post.commentCount || 0)
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [comments, setComments] = useState(post.comments || [])
    const [newComment, setNewComment] = useState("")
    const [isLoadingComments, setIsLoadingComments] = useState(false)
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    // Refs
    const commentInputRef = useRef<HTMLTextAreaElement>(null)

    // API URLs
    const API_ENDPOINTS = {
        LIKE: `/posts/${post.id}/reactions`,
        COMMENTS: `/posts/${post.id}/comments`,
    }

    // Like/Unlike functionality
    const handleLike = async () => {
        if (isLiking) return

        setIsLiking(true)

        // Store previous state for rollback
        const previousState = {
            isLiked: isReacted,
            prevReactions: [...reactions],
            likeCount: reactionCount,
        }

        try {
            // Change reaction count optimistically
            setReactionCount((prev) => (isReacted ? prev - 1 : prev + 1))

            if (isReacted) {
                const { data } = await api.delete(API_ENDPOINTS.LIKE + `/${userReaction.id}`)
                setReactions((prevReactions) => prevReactions.filter((reaction) => reaction.id !== data.data.reaction.id))
                setUserReaction(null)
                setIsReacted(false)
            } else {
                const { data } = await api.post(API_ENDPOINTS.LIKE, {
                    reactionType: "like",
                })
                setUserReaction(data.data.reaction)
                setIsReacted(true)
                setReactions((prevReactions) => [...prevReactions, data.data.reaction])
            }

            // Notify parent component if needed
            onPostUpdate?.(post.id, {
                isLiked: !isReacted,
                like_count: isReacted ? reactionCount - 1 : reactionCount + 1,
            })
        } catch (error) {
            // Revert on error
            setIsReacted(previousState.isLiked)
            setReactionCount(previousState.likeCount)
            setReactions(previousState.prevReactions)
            console.error("Failed to update like:", error)
        } finally {
            setIsLiking(false)
        }
    }

    // Load comments when modal opens
    const handleCommentClick = async () => {
        setIsCommentModalOpen(true)
        if (comments.length === 0) {
            await loadComments()
        }
        // Focus comment input after modal opens
        setTimeout(() => commentInputRef.current?.focus(), 100)
    }

    const loadComments = async () => {
        setIsLoadingComments(true)
        try {
            const response = await api.get(API_ENDPOINTS.COMMENTS)
            setComments(response.data.data.comments || [])
        } catch (error) {
            console.error("Failed to load comments:", error)
        } finally {
            setIsLoadingComments(false)
        }
    }

    // Submit new comment
    const handleSubmitComment = async () => {
        if (!newComment.trim() || isSubmittingComment) return

        setIsSubmittingComment(true)
        try {
            const { data } = await api.post(API_ENDPOINTS.COMMENTS, {
                content: newComment.trim(),
            })

            const newCommentData = data.data.comment
            setComments((prev) => [newCommentData, ...prev])
            setCommentCount((prev) => prev + 1)
            setNewComment("")

            // Notify parent component
            onPostUpdate?.(post.id, { comment_count: commentCount + 1 })
        } catch (error) {
            console.error("Failed to submit comment:", error)
        } finally {
            setIsSubmittingComment(false)
        }
    }

    return (
        <>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12 ring-2 ring-primary/10">
                                <AvatarImage src={post.authorProfilePicture || "/placeholder.svg"} />
                                <AvatarFallback className="campus-gradient text-white font-semibold">
                                    {post.authorFirstName?.[0]}
                                    {post.authorLastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-lg">
                                        {post.authorFirstName} {post.authorLastName}
                                    </h4>
                                    {post.isPinned && (
                                        <Badge variant="secondary" className="campus-gradient text-white">
                                            <Pin className="w-3 h-3 mr-1" />
                                            Pinned
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {post.authorUniversity}, {post.authorUniversityCountry}
                                </p>
                                <p className="text-xs text-muted-foreground">{timeCalc(post.approved_at)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                        <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

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
                                                {index === 3 && post.images.length > 4 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="text-white font-semibold">+{post.images.length - 4} more</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Post Stats */}
                    <div className="flex items-center justify-between px-1 mb-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {reactionCount > 0 && (
                                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                                    {reactionCount} {reactionCount === 1 ? "like" : "likes"}
                </span>
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {commentCount > 0 && `${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
                        </div>
                    </div>

                    <Separator className="mb-3" />

                    {/* Post Actions */}
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center space-x-2 hover:bg-red-50 ${
                                isReacted ? "text-red-600 bg-red-50" : "text-muted-foreground hover:text-red-600"
                            }`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            <Heart className={`w-5 h-5 ${isReacted ? "fill-current" : ""}`} />
                            <span className="font-medium">{isReacted ? "Liked" : "Like"}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                            onClick={handleCommentClick}
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">Comment</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-2 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                        >
                            <Share className="w-5 h-5" />
                            <span className="font-medium">Share</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Comments Modal */}
            <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
                <DialogContent className="max-w-2xl bg-white max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Comments
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {isLoadingComments ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex items-start space-x-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={comment.profilePicture || "/placeholder.svg"} />
                                        <AvatarFallback className="campus-gradient text-white text-sm">
                                            {comment?.firstName?.[0]}
                                            {comment?.lastName?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-muted/50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">
                        {comment?.firstName} {comment?.lastName}
                      </span>
                                            <span className="text-xs text-muted-foreground">{timeCalc(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <Separator />

                    {/* Comment Input */}
                    <div className="pt-4">
                        <div className="flex items-start space-x-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                                <AvatarFallback className="campus-gradient text-white text-sm">
                                    {user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-3">
                                <Textarea
                                    ref={commentInputRef}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="min-h-[80px] resize-none border-muted-foreground/20 focus:border-primary"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSubmitComment()
                                        }
                                    }}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSubmitComment}
                                        disabled={!newComment.trim() || isSubmittingComment}
                                        size="sm"
                                        className="campus-gradient shadow-lg"
                                    >
                                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default FeedPost
