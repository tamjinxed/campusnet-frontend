// app/events/page.tsx
'use client';

import { useState } from 'react';
import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Search, Calendar, MapPin, Users, Clock } from "lucide-react";
import Image from "next/image";
import CreateEventModal from "@/app/components/modals/CreateEventModal";

const EventsPage = () => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  
  const yourEvents = [
    {
      id: 1,
      title: "ABC CS FEST Hackathon 2025",
      date: "Dec 15, 2024",
      time: "9:00 AM",
      location: "Engineering Building, Room 101",
      organizer: "CS Student Club", 
      attendees: 45,
      image: "/placeholder.svg",
      status: "registered"
    },
    {
      id: 2,
      title: "Robotics Workshop",
      date: "Dec 20, 2024", 
      time: "2:00 PM",
      location: "Student Center, Main Hall",
      organizer: "Robotics Club",
      attendees: 78,
      image: "/placeholder.svg", 
      status: "registered"
    },
    {
      id: 3,
      title: "Photography Exhibition", 
      date: "Dec 25, 2024",
      time: "6:00 PM",
      location: "Campus Auditorium",
      organizer: "Photography Club",
      attendees: 32,
      image: "/placeholder.svg",
      status: "registered" 
    }
  ];

  const upcomingEvents = [
    {
      id: 4,
      title: "Tech Talk: AI Trends",
      date: "Jan 5, 2025",
      time: "10:00 AM", 
      location: "Computer Lab 2",
      organizer: "Tech Society",
      attendees: 23,
      image: "/placeholder.svg"
    },
    {
      id: 5, 
      title: "Debate Competition",
      date: "Jan 8, 2025",
      time: "3:00 PM",
      location: "Library Conference Room",
      organizer: "Debate Club",
      attendees: 67,
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Sports Tournament", 
      date: "Jan 12, 2025",
      time: "7:00 PM",
      location: "Campus Recreation Center", 
      organizer: "Athletics Club",
      attendees: 89,
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        <LeftSidebar />

        <main className="flex-1 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-gray-600">Discover and join exciting campus events</p>
            </div>
          </div>

          {/* Event Creation Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 h-12 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsCreateEventModalOpen(true)}
            >
              <p className="text-gray-600 text-lg">Want to Organize an Event?</p>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12"
              onClick={() => setIsCreateEventModalOpen(true)}
            >
              Create Event
            </Button>
          </div>

          {/* Your Events Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Your Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  isRegistered 
                  actionLabel="View Details" 
                  actionVariant="outline"
                />
              ))}
            </div>
          </section>

          {/* Upcoming Events Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  actionLabel="Join Event" 
                  actionVariant="default"
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal 
        open={isCreateEventModalOpen}
        onOpenChange={setIsCreateEventModalOpen}
      />
    </div>
  );
};

// Extracted EventCard component for better reusability
const EventCard = ({ 
  event, 
  isRegistered = false, 
  actionLabel, 
  actionVariant = "default" 
}: {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    attendees: number;
    image: string;
  };
  isRegistered?: boolean;
  actionLabel: string;
  actionVariant?: "default" | "outline";
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isRegistered && (
          <Badge className="absolute top-4 right-4 bg-green-500 text-white">
            Registered
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
        <p className="text-sm text-purple-600 font-medium">by {event.organizer}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <EventDetail icon={<Calendar className="w-4 h-4" />} text={event.date} />
          <EventDetail icon={<Clock className="w-4 h-4" />} text={event.time} />
          <EventDetail icon={<MapPin className="w-4 h-4" />} text={event.location} />
          <EventDetail icon={<Users className="w-4 h-4" />} text={`${event.attendees} attending`} />
        </div>
        <Button variant={actionVariant} className="w-full">
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

// Small helper component for event details
const EventDetail = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center text-gray-600 text-sm">
    <span className="mr-2">{icon}</span>
    {text}
  </div>
);

export default EventsPage;