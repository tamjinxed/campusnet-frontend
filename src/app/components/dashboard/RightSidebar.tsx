"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

const RightSidebar = () => {
  const upcomingEvents = [
    {
      title: "ABC Event 2025",
      description: "6:00 PM, Saturday at 9Th Floor...",
      date: "24th Nov, 2024",
      image: "/placeholder.svg"
    }
  ];

  const suggestedGroups = [
    {
      name: "ABC University Robotics...",
      members: "500 Members",
      image: "/placeholder.svg"
    },
    {
      name: "ABC University Science...",
      members: "1000 Members", 
      image: "/placeholder.svg"
    },
    {
      name: "ABC University Robotics...",
      members: "1000 Members",
      image: "/placeholder.svg"
    }
  ];

  const peopleYouMayKnow = [
    {
      name: "Ben John Engelson",
      description: "Student at ABC University, Bangladesh",
      image: "/placeholder.svg"
    }
  ];

  return (
    <aside className="w-80 space-y-6">
      {/* Upcoming Events */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Upcoming Event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="space-y-3">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-sm">{event.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1">{event.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Groups You May Join */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Groups You May Join</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedGroups.map((group, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={group.image} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">G</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">{group.name}</h4>
                  <p className="text-xs text-gray-600">{group.members}</p>
                </div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-4">
                Join
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* People You May Know */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">People You May Know</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {peopleYouMayKnow.map((person, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.image} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">B</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-sm">{person.name}</h4>
                  <p className="text-xs text-gray-600">{person.description}</p>
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default RightSidebar;
