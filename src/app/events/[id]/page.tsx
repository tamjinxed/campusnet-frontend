"use client";

import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Share,
  MoreHorizontal,
  Calendar,
  MapPin,
  Users,
  Clock,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

import { TopHeader } from '@/app/components/layout/topheader';
import { LeftSidebar } from '@/app/components/dashboard/LeftSidebar';

export default function SingleEvent() {
  const [activeTab, setActiveTab] = useState("discussion");
  const [isRegistered, setIsRegistered] = useState(true);
  const [likes, setLikes] = useState(25);
  const [isLiked, setIsLiked] = useState(false);

  const handleRegistration = () => {
    setIsRegistered(!isRegistered);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  // Sample data
  const attendees = [
    { id: 1, name: "John Doe", role: "Student", initials: "JD" },
    { id: 2, name: "Jane Smith", role: "Student", initials: "JS" },
    { id: 3, name: "Alex Johnson", role: "Student", initials: "AJ" },
    { id: 4, name: "Sarah Williams", role: "Student", initials: "SW" },
    { id: 5, name: "Michael Brown", role: "Student", initials: "MB" },
  ];

  const photos = [
    { id: 1, url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
    { id: 2, url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
    { id: 3, url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop" },
    { id: 4, url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop" },
  ];

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
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=300&fit=crop"
                      alt="ABC CS FEST Hackathon 2025"
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
                          ABC CS FEST Hackathon 2025
                        </h1>
                        <p className="text-muted-foreground">
                          by CS Student Club
                        </p>
                      </div>
                      <Button 
                        onClick={handleRegistration}
                        className={isRegistered ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
                      >
                        {isRegistered ? "Cancel Registration" : "Join Event"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Dec 15, 2024</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>9:00 AM</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>Engineering Building</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span>45 attending</span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        <TabsTrigger value="attendees">Attendees</TabsTrigger>
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="discussion" className="mt-4">
                        {/* Discussion content remains the same */}
                      </TabsContent>
                      
                      <TabsContent value="attendees" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Attendees ({attendees.length})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {attendees.map((attendee) => (
                              <div key={attendee.id} className="flex flex-col items-center">
                                <Avatar className="w-16 h-16 mb-2">
                                  <AvatarImage src="/placeholder.svg" />
                                  <AvatarFallback className="bg-blue-100 text-blue-600">
                                    {attendee.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <h4 className="font-medium text-sm text-center">{attendee.name}</h4>
                                <p className="text-xs text-muted-foreground">{attendee.role}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="photos" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="font-semibold">Event Photos ({photos.length})</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {photos.map((photo) => (
                              <div key={photo.id} className="overflow-hidden rounded-lg">
                                <img 
                                  src={photo.url} 
                                  alt={`Event photo ${photo.id}`}
                                  className="w-full h-32 object-cover hover:scale-105 transition-transform cursor-pointer"
                                />
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
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              CS
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">CS Student Club</h4>
                            <p className="text-sm text-muted-foreground">
                              Event Organizer
                            </p>
                            <p className="text-xs text-muted-foreground">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-foreground mb-4">
                        🚀 Get ready for the most exciting hackathon of the year!
                        ABC CS FEST Hackathon 2025 is here with amazing prizes and
                        opportunities to showcase your coding skills.
                        <br />
                        <br />
                        Join us for 48 hours of non-stop coding, networking, and
                        innovation. Whether you're a beginner or an expert, this
                        event is perfect for everyone who's passionate about
                        technology.
                        <br />
                        <br />
                        Don't forget to bring your laptops and your A-game! 💻✨
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : ''}`}
                          onClick={handleLike}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{likes} Likes</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>8 Comments</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attendee Post */}
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-green-100 text-green-600">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">John Doe</h4>
                            <p className="text-sm text-muted-foreground">
                              Student at AICD University
                            </p>
                            <p className="text-xs text-muted-foreground">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-foreground mb-4">
                        Super excited for this hackathon! 🔥 Anyone looking to form
                        a team? I'm experienced in React and Node.js. Looking for
                        designers and backend developers to join forces! <br />
                        <br />
                        Let's build something amazing together! 🚀
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Heart className="w-4 h-4" />
                          <span>12 Likes</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>5 Comments</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </Button>
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
                        <p className="font-medium">December 15, 2024</p>
                        <p className="text-muted-foreground">Saturday</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">9:00 AM - 6:00 PM</p>
                        <p className="text-muted-foreground">9 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Engineering Building</p>
                        <p className="text-muted-foreground">
                          Room 101, AICD University
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Organized by</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        CS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">CS Student Club</h4>
                      <p className="text-sm text-muted-foreground">
                        Computer Science Department
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        ORGANIZER
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Follow Club
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
                        <p className="font-medium">December 15, 2024</p>
                        <p className="text-muted-foreground">Saturday</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">9:00 AM - 6:00 PM</p>
                        <p className="text-muted-foreground">9 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Engineering Building</p>
                        <p className="text-muted-foreground">
                          Room 101, AICD University
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Organized by</h3>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        CS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">CS Student Club</h4>
                      <p className="text-sm text-muted-foreground">
                        Computer Science Department
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        ORGANIZER
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Follow Club
                  </Button>
                </CardContent>
              </Card>

              {/* Attendees */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Attendees</h3>
                    <Badge variant="secondary">45</Badge>
                  </div>
                  <div className="space-y-3">
                    {attendees.slice(0, 3).map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center space-x-3"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {attendee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {attendee.name}
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
                    {[1, 2].map((event) => (
                      <div
                        key={event}
                        className="border rounded-lg p-3 hover:bg-accent cursor-pointer"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-154057546706${event}?w=200&h=100&fit=crop`}
                          alt="Similar event"
                          className="w-full h-20 object-cover rounded mb-2"
                        />
                        <h4 className="font-medium text-sm">
                          Tech Workshop {event}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Dec 2{event}, 2024
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