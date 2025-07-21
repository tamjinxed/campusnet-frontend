'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Bell, MessageSquare, Menu, X, ChevronDown, Users, Calendar, Bookmark, Link as LinkIcon } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";

export function TopHeader() {
  const pathname = usePathname();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { logout, user } = useAuth() || {}; // Safely destructure auth context

  // Mark component as mounted (client-side)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    if (!isClient) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Helper function to determine if a link is active
  const isActive = (path: string) => pathname === path;

  // Close mobile menu and search when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileSearch(false);
  }, [pathname]);

  // Fallback avatar props
  const avatarProps = {
    src: user?.profilePicture || "/placeholder-user.jpg",
    fallback: user?.name?.charAt(0) || "U",
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto relative">
        {/* Main header content */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Left section - Logo and search (desktop) */}
          <div className="flex items-center space-x-4">
            {/* CampusNet Logo - Links to Dashboard */}
            <Link href="/dashboard" className="text-xl campus-gradient-text hover:opacity-80 transition-opacity">
              CampusNet
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search" 
                className="pl-10 w-64 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
              />
            </div>
          </div>
          
          {/* Mobile controls */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Always visible notification icon on mobile */}
            <Link 
              href="/notifications" 
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>
            
            {/* Always visible messages icon on mobile */}
            <Link 
              href="/messages" 
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
            </Link>
            
            {/* Search toggle button */}
            <button 
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setShowMobileMenu(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle Search"
            >
              {showMobileSearch ? <X className="w-5 h-5 text-gray-600" /> : <Search className="w-5 h-5 text-gray-600" />}
            </button>
            
            {/* Always visible profile avatar on mobile */}
            <Link href="/profile" className="p-1">
              <Avatar className="w-7 h-7 hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer">
                <AvatarImage src={avatarProps.src} />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {avatarProps.fallback}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowMobileSearch(false);
              }}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
          
          {/* Desktop navigation */}
          {isClient && ( // Only render on client-side
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className={`p-2 rounded-full ${isActive('/dashboard') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Feed"
                >
                  <Home className="w-5 h-5" />
                </Link>
                
                <Link 
                  href="/notifications" 
                  className={`p-2 rounded-full ${isActive('/notifications') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </Link>
                
                <Link 
                  href="/messages" 
                  className={`p-2 rounded-full ${isActive('/messages') ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:bg-gray-100'}`}
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {logout && (
                  <div className="pt-4">
                    <Button
                      onClick={logout}
                      className="w-full h-12 bg-campus-gradient hover:opacity-90 text-white font-semibold rounded-lg"
                    >
                      Logout
                    </Button>
                  </div>
                )}

                {/* More dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                      title="More"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 mt-2 z-50" sideOffset={8}>
                    <DropdownMenuItem asChild>
                      <Link href="/groups" className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Groups</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/events" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Events</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved" className="flex items-center">
                        <Bookmark className="w-4 h-4 mr-2" />
                        <span>Saved Items</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/calendar" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Calendar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/connections" className="flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        <span>Connections</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
              
              <Link href="/profile">
                <Avatar className="w-8 h-8 hover:ring-2 hover:ring-purple-300 transition-all cursor-pointer">
                  <AvatarImage src={avatarProps.src} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {avatarProps.fallback}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile search bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search CampusNet" 
                className="pl-10 w-full bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
                autoFocus
              />
            </div>
          </div>
        )}
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <nav className="flex flex-col px-4 py-2">
              <Link 
                href="/dashboard" 
                className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/dashboard') ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Feed</span>
              </Link>
              
              <div className="border-t border-gray-200 my-2"></div>

              <Link 
                href="/groups" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Groups</span>
              </Link>
              
              <Link 
                href="/events" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Events</span>
              </Link>
              
              <Link 
                href="/saved" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Bookmark className="w-5 h-5" />
                <span className="font-medium">Saved Items</span>
              </Link>
              
              <Link 
                href="/calendar" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Calendar</span>
              </Link>
              
              <Link 
                href="/connections" 
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">Connections</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}