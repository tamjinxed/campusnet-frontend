// app/components/TopHeader.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Bell, MessageSquare } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";

export function TopHeader() {
  const pathname = usePathname();

  // Helper function to determine if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          {/* CampusNet Logo - Links to Dashboard */}
          <Link href="/dashboard" className="text-xl font-bold campus-gradient-texty hover:opacity-80 transition-opacity">
            CampusNet
          </Link>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search" 
              className="pl-10 w-64 bg-gray-100 border-0"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="flex space-x-6">
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-1 pb-2 ${isActive('/feed') ? 'text-purple-600 font-medium border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Home className="w-4 h-4" />
              <span>Feed</span>
            </Link>
            
            <Link 
              href="/notifications" 
              className={`flex items-center space-x-1 pb-2 ${isActive('/notifications') ? 'text-purple-600 font-medium border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Link>
            
            <Link 
              href="/messages" 
              className={`flex items-center space-x-1 pb-2 ${isActive('/messages') ? 'text-purple-600 font-medium border-b-2 border-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </Link>
          </nav>
          
          {/* Profile Link */}
          <Link href="/profile">
            <Avatar className="w-8 h-8 hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-purple-100 text-purple-600">P</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}