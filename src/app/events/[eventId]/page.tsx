
"use client";

import React, {useEffect, useState, useRef} from "react";
import {
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  Clock, Link2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {Textarea} from "@/app/components/ui/textarea";

import { TopHeader } from '@/app/components/layout/topheader';
import { LeftSidebar } from '@/app/components/dashboard/LeftSidebar';
import {numericStringToUuid} from "@/app/utils/utils";
import {useAuth} from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import timeAgoSocialMedia from "@/app/utils/timeCalc";

// TypeScript interfaces
interface EventComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface Attendee {
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role?: string;
}

interface SuggestedEvent {
  id: string;
  title: string;
  coverImage?: string;
  startDate: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventLink?: string;
  attendeeCount: number;
  groupName?: string;
  communityName?: string;
  organizerFirstName: string;
  organizerLastName: string;
  organizerProfilePicture?: string;
  createdAt: string;
  commentCount: number;
  comments?: EventComment[];
}

function EventDetail(props: { icon: React.JSX.Element, text: string }) {
  return (
      <div className="flex items-center text-sm">
        <span className="mr-2 text-muted-foreground">{props.icon}</span>
        <span>{props.text}</span>
      </div>
  );
}

export default function SingleEvent({ params }: { params: Promise<{ eventId: string }> }) {

  let {eventId} = React.use(params);
  eventId = numericStringToUuid(eventId);
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [suggestedEvents, setSuggestedEvents] = useState<SuggestedEvent[]>([]);
  const [eventComments, setEventComments] = useState<EventComment[]>([]);
  const [userState, setUserState] = useState(null);
  const [organization, setOrganization] = useState(null);

  // Comment states
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState<EventComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Refs
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getEvent();
  }, []);

  const getEvent = async () => {
    try {
      setIsLoading(true);
      const { data : { data } } = await api.get(`/events/${eventId}`);
      const eventData = data.event;
      setEvent(eventData);

      // Set initial comment states
      setCommentCount(eventData.commentCount || 0);
      setComments(eventData.comments || []);

      const { data : { data : { attendees } } } = await api.get(`/events/${eventId}/attendees`);
      setAttendees(attendees);

      const { data : { data : { events } } } = await api.get(`/users/me/events/suggested`);
      setSuggestedEvents(events);

      const { data : { data : { comments } } } = await api.get(`/events/${eventId}/comments`);
      setEventComments(comments);
      setComments(comments); // Set comments for display

    } catch (error) {
      console.error("Failed to load event:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const [activeTab, setActiveTab] = useState("discussion");
  const [isRegistered, setIsRegistered] = useState(true);

  // API URLs
  const API_ENDPOINTS = {
    COMMENTS: `/events/${eventId}/comments`
  };

  const handleRegistration = () => {
    setIsRegistered(!isRegistered);
  };

  // Submit new comment
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const { data : { data } } = await api.post(API_ENDPOINTS.COMMENTS, {
        content: newComment.trim()
      });

      const newCommentData = data.comment;
      setComments(prev => [newCommentData, ...prev]);
      setCommentCount(prev => prev + 1);
      setNewComment("");

    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading || !event) {
    return (
        <div className="min-h-screen bg-background">
          <TopHeader />
          <div className="flex justify-center items-center h-96">
            <div className="text-center">Loading event...</div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <TopHeader />

        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - hidden on small screens */}
          <aside className="hidden lg:block">
            <LeftSidebar />
          </aside>

          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Cover */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                          src={event.coverImage}
                          alt={event.title}
                          className="w-full h-48 sm:h-64 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      {isRegistered && (
                          <Badge className="absolute top-4 left-4 bg-green-500 text-white">
                            Registered
                          </Badge>
                      )}
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold">
                            {event.title}
                          </h1>
                          <p className="text-muted-foreground">
                            by {event.groupName ? event.groupName : (event.communityName ? event.communityName : `${event.organizerFirstName} ${event.organizerLastName}`)}
                          </p>
                        </div>
                        <Button
                            onClick={handleRegistration}
                            className={isRegistered === 'attending' ? "bg-red-500 hover:bg-red-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
                        >
                          {isRegistered === 'attending' ? "Attending" : "Attend"}
                        </Button>
                        <Button
                            onClick={handleRegistration}
                            className={isRegistered === 'interested' ? "bg-red-500 hover:bg-red-600 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}
                        >
                          {isRegistered === 'interested' ? "Interested" : "Interested"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{`${new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}`}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{`${new Date(event.startDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          })}`}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          {event.location && (
                              <EventDetail icon={<MapPin className="w-3 h-3 md:w-4 md:h-4" />} text={event.location} />
                          )}
                          {event.eventLink && (
                              <EventDetail icon={<Link2 className="w-3 h-3 md:w-4 md:h-4" />} text={event.eventLink} />
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{`${event.attendeeCount} attending`}</span>
                        </div>
                      </div>

                      {/* Tabs */}
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="discussion">Discussion</TabsTrigger>
                          <TabsTrigger value="attendees">Attendees</TabsTrigger>
                        </TabsList>

                        <TabsContent value="discussion" className="mt-4">
                          {/* Discussion content remains the same */}
                        </TabsContent>

                        <TabsContent value="attendees" className="mt-4">
                          <div className="space-y-4">
                            <h3 className="font-semibold">Attendees ({attendees.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {attendees.map((attendee) => (
                                  <div key={attendee.userId} className="flex flex-col items-center">
                                    <Avatar className="w-16 h-16 mb-2">
                                      <AvatarImage src={attendee.profilePicture} />
                                      <AvatarFallback className="bg-blue-100 text-blue-600">
                                        {`${attendee.firstName.charAt(0)}${attendee.lastName.charAt(0)}`}
                                      </AvatarFallback>
                                    </Avatar>
                                    <h4 className="font-medium text-sm text-center">{`${attendee.firstName} ${attendee.lastName}`}</h4>
                                    <p className="text-xs text-muted-foreground">{attendee.role}</p>
                                  </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>

                {/* Only show discussion posts when on discussion tab */}
                {activeTab === "discussion" && (
                    <>
                      {/* Event Post */}
                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={event.organizerProfilePicture} />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {`${event.organizerFirstName[0]}${event.organizerLastName[0]}`}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">
                                  {`${event.organizerFirstName} ${event.organizerLastName}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {timeAgoSocialMedia(event.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>

                          <p className="text-foreground mb-4">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Comments Section */}
                      <Card>
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="font-semibold mb-4">Comments ({commentCount})</h3>

                          {/* New Comment Input */}
                          <div className="mb-6">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user?.profilePicture} />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-2">
                                <Textarea
                                    ref={commentInputRef}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="min-h-[60px] resize-none"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmitComment();
                                      }
                                    }}
                                />
                                <div className="flex justify-end">
                                  <Button
                                      onClick={handleSubmitComment}
                                      disabled={!newComment.trim() || isSubmittingComment}
                                      size="sm"
                                      className="bg-purple-700 hover:bg-purple-800"
                                  >
                                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Comments List */}
                          <div className="space-y-4">
                            {isLoadingComments ? (
                                <div className="text-center py-4 text-gray-500">Loading comments...</div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex items-start space-x-3">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={comment.profilePicture} />
                                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                          {comment?.firstName[0]}{comment?.lastName[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-semibold text-sm">{comment?.firstName} {comment?.lastName}</span>
                                          <span className="text-xs text-gray-500">{timeAgoSocialMedia(comment.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                      </div>
                                    </div>
                                ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                )}
              </div>

              {/* Right Sidebar - shows on bottom for mobile */}
              <div className="lg:hidden space-y-6">
                {/* Mobile version of right sidebar content */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Event Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}</p>
                          <p className="text-muted-foreground">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(event.startDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          })} - {event.endDate ? new Date(event.endDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          }) : 'TBD'}</p>
                        </div>
                      </div>
                      {event.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{event.location}</p>
                            </div>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Organized by</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={event.organizerProfilePicture} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {`${event.organizerFirstName[0]}${event.organizerLastName[0]}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{event.groupName || event.communityName || `${event.organizerFirstName} ${event.organizerLastName}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          ORGANIZER
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - hidden on small screens */}
              <aside className="hidden lg:block space-y-6">
                {/* Event Details */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Event Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}</p>
                          <p className="text-muted-foreground">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(event.startDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          })} - {event.endDate ? new Date(event.endDate).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                          }) : 'TBD'}</p>
                        </div>
                      </div>
                      {event.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{event.location}</p>
                            </div>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Organizer */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Organized by</h3>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={event.organizerProfilePicture} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {`${event.organizerFirstName[0]}${event.organizerLastName[0]}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{event.groupName || event.communityName || `${event.organizerFirstName} ${event.organizerLastName}`}</h4>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          ORGANIZER
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Follow
                    </Button>
                  </CardContent>
                </Card>

                {/* Attendees */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Attendees</h3>
                      <Badge variant="secondary">{attendees.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {attendees.slice(0, 3).map((attendee) => (
                          <div
                              key={attendee.userId}
                              className="flex items-center space-x-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={attendee.profilePicture} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {`${attendee.firstName.charAt(0)}${attendee.lastName.charAt(0)}`}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {`${attendee.firstName} ${attendee.lastName}`}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {attendee.role}
                              </p>
                            </div>
                          </div>
                      ))}
                    </div>
                    <Button
                        variant="link"
                        className="p-0 h-auto text-primary mt-4"
                        onClick={() => setActiveTab("attendees")}
                    >
                      View All Attendees →
                    </Button>
                  </CardContent>
                </Card>

                {/* Similar Events */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Similar Events</h3>
                    <div className="space-y-4">
                      {suggestedEvents.map((event) => (
                          <div
                              key={event.id}
                              className="border rounded-lg p-3 hover:bg-accent cursor-pointer"
                          >
                            <img
                                src={event.coverImage}
                                alt="Similar event"
                                className="w-full h-20 object-cover rounded mb-2"
                            />
                            <h4 className="font-medium text-sm">
                              {event.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {`${new Date(event.startDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}`}
                            </p>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </main>
        </div>
      </div>
  );
}