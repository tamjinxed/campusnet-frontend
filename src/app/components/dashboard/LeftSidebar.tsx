"use client";

import { Users, Calendar, BookmarkCheck, Network, CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

export function LeftSidebar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth() || {};

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sidebarItems: SidebarItem[] = [
    { icon: Users, label: "Groups", href: "/groups" },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: BookmarkCheck, label: "Saved Items", href: "/saved" },
    { icon: CalendarDays, label: "Calendar", href: "/calendar" },
    { icon: Network, label: "Connections", href: "/connections" },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  // Safe user data fallbacks
  const userInitials = user 
    ? `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
    : 'US';
    
  const universityName = user?.universityName || 'University';

  return (
    <aside className="w-64 space-y-4 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
      {/* Profile Card */}
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-2xl">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Badge
              variant="outline"
              className="rounded-full px-2 py-1 flex items-center space-x-1"
            >
              {isClient && user?.universityLogoUrl ? (
                <img 
                  src={user.universityLogoUrl} 
                  alt="University Logo" 
                  className="w-5 h-5" 
                />
              ) : (
                <span role="img" aria-label="university" className="text-yellow-600 text-lg">🎓</span>
              )}
              <span>{universityName}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Card */}
      <Card className="rounded-lg shadow-sm">
        <CardContent className="p-0">
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 ${
                  isActive(item.href)
                    ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                    : 'text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}