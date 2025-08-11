"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import api from "@/app/lib/axios";
import {useEffect, useState} from "react";
import {useAuth} from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import {uuidToNumericString} from "@/app/utils/utils";
import Link from "next/link";

const RightSidebar = () => {
  const {user} = useAuth();
  const router = useRouter();

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);

  useEffect(() => {
    getEvents();
    getSuggestedGroups();
    if (user?.communityId) {getPeopleYouMayKnow();}
  }, []);

  const getEvents = async () => {
    const { data : {data} } = await  api.get("/users/me/events?page=1&limit=2");
    setUpcomingEvents(data.events);
  }

  const getSuggestedGroups = async () => {
    const { data : { data }} = await api.get("/groups/suggested?page=1&limit=3");
    setSuggestedGroups(data.groups);
  }

  const getPeopleYouMayKnow = async () => {
    const { data : { data } } =  await api.get(`/communities/${user?.communityId}/members?page=1&limit=3`);
    setPeopleYouMayKnow(data.members);
  }


  return (
    <aside className="w-80 space-y-6">
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                  <div key={index} className="space-y-3" onClick={() => router.push(`/events/${encodeURIComponent(uuidToNumericString(event.id))}`)}>
                    <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-32 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{event.description.length > 50 ? `${event.description.slice(0, 50)}...` : event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{`${new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}`}</p>
                    </div>
                  </div>
              ))}
            </CardContent>
          </Card>
      )}

      {/* Groups You May Join */}
      {suggestedGroups.length > 0 && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Groups You May Join</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedGroups.map((group, index) => (
                    <Link
                        key={index}
                        href={`/groups/${encodeURIComponent(uuidToNumericString(group.id))}`}
                        className="block"
                    >
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={group.logo} />
                            <AvatarFallback className="bg-purple-100 text-purple-600">G</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{group.name}</h4>
                            <p className="text-xs text-gray-600">{group.memberCount} {group.memberCount === 1 ? 'Member' : `Members`}</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-4">
                          Join
                        </Button>
                      </div>
                    </Link>
                ))}
              </CardContent>
            </Card>
          </>
      )}

      {/* People You May Know */}
      {peopleYouMayKnow.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">People You May Know</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {peopleYouMayKnow.map((person, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={person.profilePicture} />
                        <AvatarFallback className="bg-purple-100 text-purple-600">{`${person.firstName?.charAt(0)}${person.lastName?.charAt(0)}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-sm">{`${person.firstName} ${person.lastName}`}</h4>
                        <p className="text-xs text-gray-600">{person.bio}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Connect
                    </Button>
                  </div>
              ))}
            </CardContent>
          </Card>
      )}
    </aside>
  );
};

export default RightSidebar;
