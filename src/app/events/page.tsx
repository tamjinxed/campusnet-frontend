'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {Search, Calendar, MapPin, Users, Clock, Plus, Link2} from "lucide-react";

import CreateEventModal from "@/app/components/modals/CreateEventModal";
import api from "@/app/lib/axios";
import {uuidToNumericString} from "@/app/utils/utils";

const EventsPage = () => {
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  const [userEvents, setUserEvents] = useState([]);
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    const { data : { data } } = await api.get("/users/me/events");
    setUserEvents(data.events);

    const { data : { data: suggestedEvents } } = await api.get("/users/me/events/suggested");
    setSuggestedEvents(suggestedEvents.events);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />

      <div className="max-w-7xl mx-auto flex gap-6 p-4 lg:p-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
          <LeftSidebar />
        </div>

        <main className="flex-1 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Events</h1>
              <p className="text-sm md:text-base text-gray-600">Discover and join exciting campus events</p>
            </div>
          </div>

          {/* Event Creation */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 border border-gray-300 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <p className="text-gray-700 text-sm md:text-base font-medium">
                Want to organize an event?
              </p>

              <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 h-10 text-sm"
                  onClick={() => setIsCreateEventModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Create Event</span>
              </Button>
            </div>
          </div>


          {/* Your Events */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Your Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {userEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={event.userStatus}
                  actionLabel="View Details"
                  actionVariant="outline"
                />
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {suggestedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isRegistered={undefined}
                  actionLabel="Join Event"
                  actionVariant="default"
                />
              ))}
            </div>
          </section>
        </main>
      </div>

      <CreateEventModal
        open={isCreateEventModalOpen}
        onOpenChange={setIsCreateEventModalOpen}
      />
    </div>
  );
};

const EventCard = ({
  event,
  isRegistered = undefined,
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
    attendeeCount: number;
    communityName: string | null;
    groupName: string | null;
    userStatus: string;
    coverImage: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  isRegistered?: string | undefined;
  actionLabel: string;
  actionVariant?: "default" | "outline";
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/events/${encodeURIComponent(uuidToNumericString(event.id))}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="hover:shadow-lg transition-shadow h-full flex flex-col cursor-pointer"
    >
      <div className="relative h-40 md:h-48">
        <Image
          src={event.coverImage || "#"}
          alt={event.title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isRegistered && (
          <Badge className="absolute top-2 right-2 md:top-4 md:right-4 bg-green-500 text-white text-xs md:text-sm">
            {event.userStatus[0].toUpperCase() + event.userStatus.slice(1)}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg line-clamp-2">{event.title}</CardTitle>
        <p className="text-xs md:text-sm text-purple-600 font-medium">by {event.groupName ? event.groupName : (event.communityName ? event.communityName : `${event.organizerFirstName} ${event.organizerLastName}`)}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
          <EventDetail icon={<Calendar className="w-3 h-3 md:w-4 md:h-4" />} text={`${new Date(event.startDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric'
          })}`} />
          <EventDetail icon={<Clock className="w-3 h-3 md:w-4 md:h-4" />} text={`${new Date(event.startDate).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true
          })}`} />
          {event.location && (
              <EventDetail icon={<MapPin className="w-3 h-3 md:w-4 md:h-4" />} text={event.location} />
          )}
          {event.eventLink && (
              <EventDetail icon={<Link2 className="w-3 h-3 md:w-4 md:h-4" />} text={event.eventLink} />
          )}
          <EventDetail icon={<Users className="w-3 h-3 md:w-4 md:h-4" />} text={`${event.attendeeCount} attending`} />
        </div>
        <Button
          variant={actionVariant}
          className="w-full mt-auto text-sm md:text-base"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

const EventDetail = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center text-gray-600 text-xs md:text-sm">
    <span className="mr-1 md:mr-2">{icon}</span>
    <span>{text}</span>
  </div>
);

export default EventsPage;
