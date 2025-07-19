import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const About = () => {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Chief Executive Officer",
      university: "ABC University",
      description: "John is passionate about connecting students and building communities that foster growth and learning.",
      image: "/placeholder.svg"
    },
    {
      name: "Jane Smith", 
      role: "Head of Operations",
      university: "ABC University",
      description: "Jane leads our operations team and ensures smooth platform functionality for all users.",
      image: "/placeholder.svg"
    },
    {
      name: "Mike Johnson",
      role: "Chief Technology Officer", 
      university: "ABC University",
      description: "Mike drives our technical innovation and platform development initiatives.",
      image: "/placeholder.svg"
    },
    {
      name: "Sarah Wilson",
      role: "Community Manager",
      university: "ABC University", 
      description: "Sarah helps build and maintain strong relationships within our campus communities.",
      image: "/placeholder.svg"
    },
    {
      name: "Alex Brown",
      role: "Product Designer",
      university: "ABC University",
      description: "Alex creates intuitive and engaging user experiences for our platform.",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/placeholder.svg" 
              alt="Students collaborating" 
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to CampusNet - your digital gateway to campus life. We're a passionate team of developers, designers, and community builders dedicated to transforming how students connect, learn, and grow together at their universities and beyond.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Born from the belief that meaningful student voices and connections can drive positive institutional outcomes, CampusNet empowers students to form groups, share ideas, organize events, and build meaningful networks. Whether it's your academic journey, social connections, or personal development, CampusNet brings it all together in one vibrant community.
            </p>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-campus-purple font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-3">{member.university}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Get in Touch Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Get in Touch</h2>
          <p className="text-gray-600 text-center mb-8">We'd love to hear from you</p>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Mail className="w-8 h-8 text-campus-purple mx-auto" />
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">support@campusnet.university.edu</p>
            </div>
            <div className="space-y-2">
              <Phone className="w-8 h-8 text-campus-purple mx-auto" />
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="space-y-2">
              <MapPin className="w-8 h-8 text-campus-purple mx-auto" />
              <h3 className="font-semibold text-gray-900">Location</h3>
              <p className="text-gray-600">123 Main St, University City</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - EXACT COPY AS REQUESTED */}
      <footer className="bg-campus-gradienty text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16">
            {/* Column 1: Logo + Contact Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-extrabold campus-gradient-texty">CampusNet</h3>
              <ul className="space-y-4 text-sm font-semibold text-gray-100 leading-relaxed">
                <li className="flex items-center gap-2">
                  <span>📧</span> support.campusnet@gmail.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +880123-4567891
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> ABC Road, Dhaka, Bangladesh
                </li>
              </ul>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-4">
              <ul className="space-y-4 text-sm font-semibold text-gray-100 leading-loose">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/communities">Communities</Link></li>
                <li><Link href="/groups">Groups</Link></li>
                <li><Link href="/events">Events</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-4">
              <ul className="space-y-4 text-sm font-semibold text-gray-100 leading-loose">
                <li><Link href="/terms">Terms of Use</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Column 4: Social Icons */}
            <div className="flex gap-6 items-start pt-2 text-xl">
              <Link href="#">
                <img 
                  src="/img/fb.png" 
                  alt="Facebook" 
                  className="h-32px w-32pxw-[32px] h-[32px] top-[4753px] left-[1291px]"
                />
              </Link>
              <Link href="#">
                <img 
                  src="/img/ig.png" 
                  alt="Instagram"
                  className="h-32px w-32pxw-[32px] h-[32px] top-[4753px] left-[1291px]"
                />
              </Link>
              <Link href="#">
                <img 
                  src="/img/x.png" 
                  alt="Twitter"
                  className="h-32px w-32pxw-[32px] h-[32px] top-[4753px] left-[1291px]"
                />
              </Link>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 mt-20 pt-8 text-center text-gray-200 text-sm font-semibold">
            <p>&copy; Copyright 2024. All Rights Reserved by CampusNet</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;