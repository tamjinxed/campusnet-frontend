'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { X } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateEventModal = ({ open, onOpenChange }: CreateEventModalProps) => {
  const [eventType, setEventType] = useState("online");
  const timezones = [
    "UTC-12:00",
    "UTC-11:00",
    "UTC-10:00",
    // Add more timezones as needed
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden h-[80vh] flex flex-col">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Organize an Event</DialogTitle>
          </DialogHeader>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Cover Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="text-center">
                <p className="text-gray-500">Click to upload</p>
                <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x600px</p>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name</Label>
              <Input 
                id="eventName" 
                placeholder="Enter event name" 
                className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your event..." 
                className="mt-1 min-h-24 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="rules" className="text-sm font-medium text-gray-700">Rules</Label>
              <Textarea 
                id="rules" 
                placeholder="Event rules and guidelines..." 
                className="mt-1 min-h-20 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="community" className="text-sm font-medium text-gray-700">Community</Label>
              <Input 
                id="community" 
                defaultValue="AICD University Community" 
                className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Improved Timezone Selector */}
            <div>
              <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
              <Select>
                <SelectTrigger className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz} className="hover:bg-gray-100">
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="datetime-local" 
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</Label>
                <Input 
                  id="endDate" 
                  type="datetime-local" 
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Event Type Radio Group */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Event Type</Label>
              <RadioGroup 
                value={eventType} 
                onValueChange={setEventType} 
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  <RadioGroupItem value="online" id="online" className="text-purple-600 border-gray-300" />
                  <Label htmlFor="online" className="text-sm font-medium cursor-pointer">Online Event</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  <RadioGroupItem value="in-person" id="in-person" className="text-purple-600 border-gray-300" />
                  <Label htmlFor="in-person" className="text-sm font-medium cursor-pointer">In-person Event</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Location Fields (conditionally shown) */}
            {eventType === 'in-person' && (
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Event Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter event location" 
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            {eventType === 'online' && (
              <div>
                <Label htmlFor="link" className="text-sm font-medium text-gray-700">Event Link</Label>
                <Input 
                  id="link" 
                  placeholder="https://" 
                  className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            )}

            <div>
              <Label htmlFor="maxAttendees" className="text-sm font-medium text-gray-700">Max Attendees</Label>
              <Input 
                id="maxAttendees" 
                type="number" 
                placeholder="Enter maximum attendees" 
                className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Footer with submit button - now properly fixed at bottom */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-3">
            By continuing, you agree with our <span className="text-purple-600 underline cursor-pointer">event's policy</span>
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-md font-medium">
            Organize Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;