"use client";
import { useState } from "react";
import { TopHeader } from "@/app/components/layout/topheader";
import { LeftSidebar } from "@/app/components/dashboard/LeftSidebar";
import { Button } from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  title: string;
  color: string;
}

interface Events {
  [key: string]: CalendarEvent[];
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Initialize with a fallback date if needed
    try {
      return new Date(2025, 4); // May 2025
    } catch (e) {
      console.error("Date initialization failed, falling back to current date");
      return new Date();
    }
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date | null): Date[] => {
    if (!date) return [];
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days: Date[] = [];
      const current = new Date(startDate);
      
      while (current <= lastDay || days.length < 42) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
        if (days.length >= 42) break;
      }
      
      return days;
    } catch (e) {
      console.error("Failed to generate calendar days", e);
      return [];
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      try {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      } catch (e) {
        console.error("Failed to navigate month", e);
        return prev; // Return unchanged date on error
      }
    });
  };

  const days = getDaysInMonth(currentDate);

  // Sample events (safe even if SSG runs)
  const events: Events = {
    '2025-05-06': [{ title: 'ABC Event', color: 'bg-blue-100 text-blue-800' }],
    '2025-05-07': [{ title: 'ABC Event', color: 'bg-blue-100 text-blue-800' }],
    '2025-05-13': [{ title: 'ABC Event', color: 'bg-blue-100 text-blue-800' }],
    '2025-05-27': [
      { title: 'ABC Event', color: 'bg-blue-100 text-blue-800' },
      { title: 'ABC Event', color: 'bg-blue-100 text-blue-800' },
      { title: 'ABC Event', color: 'bg-blue-100 text-blue-800' }
    ],
    '2025-05-28': [
      { title: 'ABC Event', color: 'bg-blue-100 text-blue-800' },
      { title: 'ABC Event', color: 'bg-blue-100 text-blue-800' }
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safely render TopHeader (assumes it handles null user internally) */}
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-4 md:gap-6 p-4 md:p-6">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
          <LeftSidebar />
        </div>

        <main className="flex-1 overflow-x-hidden">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 md:p-6 border-b">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-lg md:text-xl font-semibold">Calendar</h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="p-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-base md:text-lg font-medium whitespace-nowrap">
                    {currentDate ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : "Loading..."}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="p-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-2 md:p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden mb-1">
                {daysOfWeek.map((day) => (
                  <div 
                    key={day} 
                    className="bg-gray-50 p-2 md:p-4 text-center font-medium text-gray-700 text-xs md:text-sm"
                  >
                    {day.substring(0, 1)}
                    <span className="hidden sm:inline">{day.substring(1)}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {days.map((day, index) => {
                  const dateStr = day?.toISOString()?.split('T')[0] || "";
                  const dayEvents = dateStr ? events[dateStr] || [] : [];
                  const isCurrentMonth = day?.getMonth() === currentDate?.getMonth();
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-1 md:p-2 min-h-[60px] md:min-h-[80px] lg:min-h-[120px] ${
                        !isCurrentMonth ? 'text-gray-400' : ''
                      }`}
                    >
                      <div className="text-xs md:text-sm font-medium mb-1">
                        {day?.getDate() || ""}
                      </div>
                      <div className="space-y-0.5 md:space-y-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className={`text-[10px] md:text-xs px-1 py-0.5 md:px-2 md:py-1 rounded ${event?.color || "bg-gray-100"} truncate`}
                          >
                            {event?.title || "Event"}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] md:text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;