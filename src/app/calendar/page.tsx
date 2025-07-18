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
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4)); // May 2025

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
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
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  // Sample events for specific dates
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
      <TopHeader />
      
      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        <LeftSidebar />

        <main className="flex-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Calendar</h1>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-medium">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Header row */}
                {daysOfWeek.map((day) => (
                  <div key={day} className="bg-gray-50 p-4 text-center font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {days.map((day, index) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const dayEvents = events[dateStr] || [];
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  
                  return (
                    <div 
                      key={index} 
                      className={`bg-white p-2 min-h-[120px] ${
                        !isCurrentMonth ? 'text-gray-400' : ''
                      }`}
                    >
                      <div className="text-sm font-medium mb-2">
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map((event, eventIndex) => (
                          <div 
                            key={eventIndex}
                            className={`text-xs px-2 py-1 rounded ${event.color} truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
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