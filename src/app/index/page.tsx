import Navbar from '@/app/components/Navbar';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link"; // Changed from react-router-dom
import { Users, Calendar, MessageSquare, Trophy, BookOpen, Heart } from "lucide-react";

const IndexPage = () => {
  const features = [
    {
      icon: Users,
      title: "Connect & Thrive in Campus Groups",
      description: "Join verified university communities, create student-led groups, and connect with peers who share your interests and passions."
    },
    {
      icon: Calendar,
      title: "Discover Exciting Events",
      description: "Find, join, and track intra and inter-campus events. Never miss out on workshops, competitions, or social gatherings."
    },
    {
      icon: MessageSquare,
      title: "Stay Informed",
      description: "Get real-time campus news, announcements, and updates. Stay connected with what's happening in your university community."
    },
    {
      icon: Trophy,
      title: "Opportunities & Growth",
      description: "Access scholarship news, competition announcements, and company hiring updates tailored for students."
    },
    {
      icon: BookOpen,
      title: "Share Resources",
      description: "Collaborate and share educational resources across different universities to enhance learning experiences."
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Access emergency blood group notifications and connect with alumni networks for mentorship and career guidance."
    }
  ];

  const upcomingEvents = [
    {
      title: "TECH ENTREPRENEURSHIP DAY",
      date: "DEC 15",
      time: "10:00 AM - 6:00 PM",
      location: "Innovation Hub",
      attendees: "150+ attending"
    },
    {
      title: "INTER UNIVERSITY DEBATE",
      date: "DEC 18",
      time: "2:00 PM - 5:00 PM",
      location: "Main Auditorium",
      attendees: "80+ attending"
    },
    {
      title: "ROBOTICS CLUB WORKSHOP",
      date: "DEC 20",
      time: "11:00 AM - 4:00 PM",
      location: "Engineering Lab",
      attendees: "45+ attending"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Join Your{" "}
                  <span className="campus-gradient-text">Campus Community</span>{" "}
                  Today!
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with fellow students, discover exciting events, and build meaningful relationships within your university ecosystem.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" >
                  <Button className="bg-campus-gradient hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl">
                    Get Started
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-gray-300 px-8 py-6 text-lg rounded-xl hover:bg-gray-50">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-campus-gradient rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-campus-gradient rounded-full animate-pulse-gentle"></div>
                    <span className="font-semibold text-gray-800">Campus Feed</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg"></div>
                    <div className="flex space-x-4 pt-2">
                      <div className="h-8 bg-campus-gradient rounded-full w-16"></div>
                      <div className="h-8 bg-gray-100 rounded-full w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-campus-blue rounded-full animate-float opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-campus-purple rounded-full animate-float opacity-20" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Connect & Thrive in Campus Groups</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover everything your campus community has to offer with our comprehensive platform designed for student success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-campus-gradient rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-600">Don't miss out on exciting campus activities</p>
            </div>
            <Link href="/events" >
              <Button className="bg-campus-gradient hover:opacity-90 text-white">
                View All Events
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-0">
                  <div className="h-48 bg-campus-gradient-light rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-gray-800">
                          {event.title}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{event.date} • {event.time}</div>
                          <div>{event.location}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-campus-purple font-medium">
                      {event.attendees}
                    </div>
                    <Button className="w-full mt-4 bg-campus-gradient hover:opacity-90 text-white">
                      Join Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-campus-gradient">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Join Your Campus Community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get verified with your education email and start connecting with thousands of students across universities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" >
                <Button className="bg-white text-campus-purple hover:bg-gray-100 px-8 py-6 text-lg rounded-xl font-semibold">
                  Sign Up Now
                </Button>
              </Link>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-campus-purple px-8 py-6 text-lg rounded-xl">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold campus-gradient-text mb-4">CampusNet</h3>
              <p className="text-gray-400 leading-relaxed">
                Connecting university communities and empowering student engagement across campuses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/communities">Communities</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/groups">Groups</Link></li>
                <li><Link href="/messaging">Messaging</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get in Touch</h4>
              <p className="text-gray-400">
                Have questions? We'd love to hear from you.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusNet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;