"use client"

import React, { useEffect, useState, useRef } from "react"
import {
    MoreHorizontal,
    Calendar,
    MapPin,
    Users,
    Clock,
    Link2,
    Heart,
    MessageSquare,
    Share2,
    ArrowLeft,
    CheckCircle,
    Star,
    ExternalLink,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Textarea } from "@/app/components/ui/textarea"
import { Separator } from "@/app/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"

import { TopHeader } from "@/app/components/layout/topheader"
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar"
import { numericStringToUuid, uuidToNumericString } from "@/app/utils/utils"
import { useAuth } from "@/app/context/AuthContext"
import api from "@/app/lib/axios"
import timeAgoSocialMedia from "@/app/utils/timeCalc"
import { useRouter } from "next/navigation"

// TypeScript interfaces
interface EventComment {
    id: string
    userId: string
    content: string
    createdAt: string
    authorFirstName: string
    authorLastName: string
    profilePicture?: string
}

interface Attendee {
    userId: string
    firstName: string
    lastName: string
    profilePicture?: string
    role?: string
    status?: "attending" | "interested"
}

interface SuggestedEvent {
    id: string
    title: string
    coverImage?: string
    startDate: string
    location?: string
    attendeeCount?: number
}

interface Event {
    id: string
    title: string
    description: string
    coverImage?: string
    startDate: string
    endDate?: string
    location?: string
    eventLink?: string
    attendeeCount: number
    groupName?: string
    communityName?: string
    organizerFirstName: string
    organizerLastName: string
    organizerProfilePicture?: string
    createdAt: string
    commentCount: number
    comments?: EventComment[]
}

export default function SingleEvent({ params }: { params: Promise<{ eventId: string }> }) {
    let { eventId } = React.use(params)
    eventId = numericStringToUuid(eventId)
    const { user } = useAuth()
    const router = useRouter()

    const [event, setEvent] = useState<Event | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [suggestedEvents, setSuggestedEvents] = useState<SuggestedEvent[]>([])
    const [userAttendanceStatus, setUserAttendanceStatus] = useState<"none" | "attending" | "interested">("none")

    // Comment states
    const [commentCount, setCommentCount] = useState(0)
    const [comments, setComments] = useState<EventComment[]>([])
    const [newComment, setNewComment] = useState("")
    const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    // UI states
    const [activeTab, setActiveTab] = useState("discussion")
    const [showAllAttendees, setShowAllAttendees] = useState(false)

    // Refs
    const commentInputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        getEvent()
    }, [eventId])

    const getEvent = async () => {
        try {
            setIsLoading(true)
            const {
                data: { data },
            } = await api.get(`/events/${eventId}`)
            const eventData = data.event
            setEvent(eventData)

            // Set initial comment states
            setCommentCount(eventData.commentCount || 0)
            setComments(eventData.comments || [])

            const {
                data: {
                    data: { attendees },
                },
            } = await api.get(`/events/${eventId}/attendees`)
            setAttendees(attendees)

            const {
                data: {
                    data: { events },
                },
            } = await api.get(`/users/me/events/suggested`)
            setSuggestedEvents(events)

            const {
                data: {
                    data: { comments },
                },
            } = await api.get(`/events/${eventId}/comments`)
            setComments(comments) // Set comments for display
        } catch (error) {
            console.error("Failed to load event:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAttendanceChange = (status: "attending" | "interested") => {
        if (userAttendanceStatus === status) {
            setUserAttendanceStatus("none")
        } else {
            setUserAttendanceStatus(status)
        }
    }

    const handleSubmitComment = async () => {
        if (!newComment.trim() || isSubmittingComment) return

        setIsSubmittingComment(true)
        try {
            const {
                data: { data },
            } = await api.post(`/events/${eventId}/comments`, {
                content: newComment.trim(),
            })

            const newCommentData = data.comment
            setComments((prev) => [newCommentData, ...prev])
            setCommentCount((prev) => prev + 1)
            setNewComment("")
        } catch (error) {
            console.error("Failed to submit comment:", error)
        } finally {
            setIsSubmittingComment(false)
        }
    }

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
            time: date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }),
            weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Loading event...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-muted">
                <TopHeader />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
                        <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
                        <Button onClick={() => router.back()}>Go Back</Button>
                    </div>
                </div>
            </div>
        )
    }

    const eventDate = formatEventDate(event.startDate)
    const endDate = event.endDate ? formatEventDate(event.endDate) : null

    return (
        <div className="min-h-screen bg-muted flex flex-col">
            <TopHeader />
            <div className="max-w-7xl mx-auto flex gap-6 p-4 md:p-6">
            <div className="flex flex-1">
                <div className="hidden md:block">
                    <LeftSidebar />
                </div>

                <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button */}
                        <div className="mb-4">
                            <Button variant="ghost" onClick={() => router.back()} className="hover:bg-muted">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Events
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Event Header */}
                                <Card className="shadow-lg overflow-hidden">
                                    <div className="relative">
                                        <img
                                            src={event.coverImage || "/placeholder.svg?height=300&width=800&text=Event+Cover"}
                                            alt={event.title}
                                            className="w-full h-48 md:h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Event Actions */}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Share2 className="w-4 h-4 mr-2" />
                                                        Share Event
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Heart className="w-4 h-4 mr-2" />
                                                        Save Event
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Attendance Status Badge */}
                                        {userAttendanceStatus !== "none" && (
                                            <div className="absolute top-4 left-4">
                                                <Badge
                                                    className={
                                                        userAttendanceStatus === "attending" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                                                    }
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    {userAttendanceStatus === "attending" ? "Attending" : "Interested"}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Event Title Overlay */}
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
                                            <p className="text-white/90">
                                                Organized by{" "}
                                                {event.groupName ||
                                                    event.communityName ||
                                                    `${event.organizerFirstName} ${event.organizerLastName}`}
                                            </p>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        {/* Quick Event Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Calendar className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-sm">{eventDate.date}</p>
                                                    <p className="text-xs text-muted-foreground">{eventDate.weekday}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Clock className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-sm">{eventDate.time}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {endDate ? `Until ${endDate.time}` : "Start time"}
                                                    </p>
                                                </div>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                    <div>
                                                        <p className="font-medium text-sm truncate">{event.location}</p>
                                                        <p className="text-xs text-muted-foreground">Location</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Users className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium text-sm">{event.attendeeCount}</p>
                                                    <p className="text-xs text-muted-foreground">Attending</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                            <Button
                                                onClick={() => handleAttendanceChange("attending")}
                                                className={
                                                    userAttendanceStatus === "attending"
                                                        ? "bg-green-500 hover:bg-green-600 text-white flex-1"
                                                        : "campus-gradient flex-1"
                                                }
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                {userAttendanceStatus === "attending" ? "Attending" : "Attend"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleAttendanceChange("interested")}
                                                className={`flex-1 ${
                                                    userAttendanceStatus === "interested" ? "border-blue-500 text-blue-600 bg-blue-50" : ""
                                                }`}
                                            >
                                                <Star className="w-4 h-4 mr-2" />
                                                {userAttendanceStatus === "interested" ? "Interested" : "Interested"}
                                            </Button>
                                            {event.eventLink && (
                                                <Button variant="outline" asChild>
                                                    <a href={event.eventLink} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Event Link
                                                    </a>
                                                </Button>
                                            )}
                                        </div>

                                        {/* Tabs */}
                                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                                <TabsTrigger value="attendees">Attendees ({attendees.length})</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="discussion" className="mt-6 space-y-6">
                                                {/* Event Description */}
                                                <Card>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage src={event.organizerProfilePicture || "/placeholder.svg"} />
                                                                <AvatarFallback className="campus-gradient text-white">
                                                                    {`${event.organizerFirstName[0]}${event.organizerLastName[0]}`}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="font-semibold">
                                                                        {`${event.organizerFirstName} ${event.organizerLastName}`}
                                                                    </h3>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        ORGANIZER
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{timeAgoSocialMedia(event.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="prose prose-sm max-w-none">
                                                            <p className="text-foreground leading-relaxed">{event.description}</p>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Comments Section */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <MessageSquare className="w-5 h-5" />
                                                            Comments ({commentCount})
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        {/* New Comment Input */}
                                                        <div className="flex items-start gap-3">
                                                            <Avatar className="w-10 h-10">
                                                                <AvatarImage src={user?.profilePicture || "/placeholder.svg"} />
                                                                <AvatarFallback className="campus-gradient text-white">
                                                                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 space-y-3">
                                                                <Textarea
                                                                    ref={commentInputRef}
                                                                    value={newComment}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    placeholder="Write a comment..."
                                                                    className="min-h-[80px] resize-none"
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
                                                                        className="campus-gradient"
                                                                    >
                                                                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Separator />

                                                        {/* Comments List */}
                                                        <div className="space-y-4">
                                                            {comments.length === 0 ? (
                                                                <div className="text-center py-8 text-muted-foreground">
                                                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                                    <p>No comments yet. Be the first to comment!</p>
                                                                </div>
                                                            ) : (
                                                                comments.map((comment) => (
                                                                    <div key={comment.id} className="flex items-start gap-3">
                                                                        <Avatar className="w-8 h-8">
                                                                            <AvatarImage src={comment.profilePicture || "/placeholder.svg"} />
                                                                            <AvatarFallback className="campus-gradient text-white text-xs">
                                                                                {comment?.authorFirstName?.charAt(0)}
                                                                                {comment?.authorLastName?.charAt(0)}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="flex-1 bg-muted/50 rounded-lg p-4">
                                                                            <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-sm">
                                          {comment?.authorFirstName} {comment?.authorLastName}
                                        </span>
                                                                                <span className="text-xs text-muted-foreground">
                                          {timeAgoSocialMedia(comment.createdAt)}
                                        </span>
                                                                            </div>
                                                                            <p className="text-sm leading-relaxed">{comment.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>

                                            <TabsContent value="attendees" className="mt-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Attendees
                              </span>
                                                            <Badge variant="secondary">{attendees.length}</Badge>
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {(showAllAttendees ? attendees : attendees.slice(0, 9)).map((attendee) => (
                                                                <div
                                                                    key={attendee.userId}
                                                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                                                    onClick={() => router.push(`/profile/${attendee.userId}`)}
                                                                >
                                                                    <Avatar className="w-12 h-12">
                                                                        <AvatarImage src={attendee.profilePicture || "/placeholder.svg"} />
                                                                        <AvatarFallback className="campus-gradient text-white">
                                                                            {`${attendee.firstName.charAt(0)}${attendee.lastName.charAt(0)}`}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-medium text-sm truncate">
                                                                            {`${attendee.firstName} ${attendee.lastName}`}
                                                                        </h4>
                                                                        <p className="text-xs text-muted-foreground truncate">{attendee.role}</p>
                                                                        {attendee.status && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className={`text-xs mt-1 ${
                                                                                    attendee.status === "attending"
                                                                                        ? "border-green-500 text-green-600"
                                                                                        : "border-blue-500 text-blue-600"
                                                                                }`}
                                                                            >
                                                                                {attendee.status}
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {attendees.length > 9 && (
                                                            <div className="mt-4 text-center">
                                                                <Button variant="outline" onClick={() => setShowAllAttendees(!showAllAttendees)}>
                                                                    {showAllAttendees ? "Show Less" : `Show All ${attendees.length} Attendees`}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Sidebar */}
                            <div className="space-y-6">
                                {/* Event Details */}
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            Event Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">{eventDate.date}</p>
                                                    <p className="text-sm text-muted-foreground">{eventDate.weekday}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-4 h-4 mt-1 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {eventDate.time}
                                                        {endDate && ` - ${endDate.time}`}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {endDate && eventDate.date !== endDate.date ? `Ends ${endDate.date}` : "Event time"}
                                                    </p>
                                                </div>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{event.location}</p>
                                                        <p className="text-sm text-muted-foreground">Event location</p>
                                                    </div>
                                                </div>
                                            )}
                                            {event.eventLink && (
                                                <div className="flex items-start gap-3">
                                                    <Link2 className="w-4 h-4 mt-1 text-muted-foreground" />
                                                    <div>
                                                        <a
                                                            href={event.eventLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="font-medium text-primary hover:underline"
                                                        >
                                                            Event Link
                                                        </a>
                                                        <p className="text-sm text-muted-foreground">External link</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Organizer */}
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Organized by</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={event.organizerProfilePicture || "/placeholder.svg"} />
                                                <AvatarFallback className="campus-gradient text-white">
                                                    {`${event.organizerFirstName[0]}${event.organizerLastName[0]}`}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4 className="font-medium">
                                                    {event.groupName ||
                                                        event.communityName ||
                                                        `${event.organizerFirstName} ${event.organizerLastName}`}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">Event Organizer</p>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    ORGANIZER
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button variant="outline" className="w-full bg-transparent">
                                            Follow
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Quick Attendees Preview */}
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Attendees</span>
                                            <Badge variant="secondary">{attendees.length}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {attendees.slice(0, 4).map((attendee) => (
                                                <div
                                                    key={attendee.userId}
                                                    className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                                                    onClick={() => router.push(`/profile/${attendee.userId}`)}
                                                >
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={attendee.profilePicture || "/placeholder.svg"} />
                                                        <AvatarFallback className="campus-gradient text-white text-xs">
                                                            {`${attendee.firstName.charAt(0)}${attendee.lastName.charAt(0)}`}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-sm truncate">
                                                            {`${attendee.firstName} ${attendee.lastName}`}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground truncate">{attendee.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {attendees.length > 4 && (
                                            <Button
                                                variant="link"
                                                className="w-full mt-3 p-0 h-auto text-primary"
                                                onClick={() => setActiveTab("attendees")}
                                            >
                                                View All {attendees.length} Attendees →
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Similar Events */}
                                {suggestedEvents.length > 0 && (
                                    <Card className="shadow-lg">
                                        <CardHeader>
                                            <CardTitle>Similar Events</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {suggestedEvents.slice(0, 3).map((suggestedEvent) => (
                                                    <div
                                                        key={suggestedEvent.id}
                                                        onClick={() =>
                                                            router.push(`/events/${encodeURIComponent(uuidToNumericString(suggestedEvent.id))}`)
                                                        }
                                                        className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                                                    >
                                                        <img
                                                            src={
                                                                suggestedEvent.coverImage ||
                                                                "/placeholder.svg?height=80&width=200&text=Event+Cover" ||
                                                                "/placeholder.svg" ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt="Similar event"
                                                            className="w-full h-20 object-cover rounded mb-3"
                                                        />
                                                        <h4 className="font-medium text-sm mb-1 line-clamp-2">{suggestedEvent.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formatEventDate(suggestedEvent.startDate).date}</span>
                                                        </div>
                                                        {suggestedEvent.location && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <MapPin className="w-3 h-3" />
                                                                <span className="truncate">{suggestedEvent.location}</span>
                                                            </div>
                                                        )}
                                                        {suggestedEvent.attendeeCount && (
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                                <Users className="w-3 h-3" />
                                                                <span>{suggestedEvent.attendeeCount} attending</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        </div>
    )
}
