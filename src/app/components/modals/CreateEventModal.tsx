'use client';

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import api from "@/app/lib/axios";
import { supabaseAdmin } from "@/app/lib/supabase";
import { useAuth } from "@/app/context/AuthContext";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EventLocation {
  id: string;
  name: string;
  type: "community" | "group";
}

const CreateEventModal = ({ open, onOpenChange }: CreateEventModalProps) => {
  const { user } = useAuth();

  const [eventType, setEventType] = useState("in-person");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>(undefined);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);

  // State for dropdown options
  const [locations, setLocations] = useState<EventLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const coverImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch communities and groups when modal opens
    if (open && locations.length === 0) {
      const fetchEventLocations = async () => {
        setIsLoading(true);
        try {
          // Fetch both communities and groups in parallel
          const [communitiesResponse, groupsResponse] = await Promise.all([
            api.get("/communities/my"),
            api.get("/groups/my"),
          ]);

          const community = communitiesResponse.data.data.communities;

          // Format the data into a unified structure
          const userCommunity = {
            id: community.id,
            name: community.name,
            type: "community" as const,
          };

          const userGroups = groupsResponse.data.data.groups.map((group: any) => ({
            id: group.id,
            name: group.name,
            type: "group" as const,
          }));

          // Combine them into one list
          setLocations([userCommunity, ...userGroups]);

          // Set default selected value
          if (userCommunity) {
            setSelectedCommunityId(userCommunity.id);
          }
        } catch (err) {
          console.error("Failed to fetch communities or groups:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventLocations();
    }
  }, [open, locations.length]);

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Reset form
      setEventName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setEventLink("");
      setMaxAttendees("");
      setCoverImage(null);
      setEventType("in-person");
      setIsPublic(true);
      setSelectedCommunityId(undefined);
      setSelectedGroupId(undefined);
    }
    onOpenChange(open);
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        return;
      }
      setCoverImage(file);
    }
  };

  const handleLocationSelect = (locationId: string) => {
    const selectedLocation = locations.find(loc => loc.id === locationId);
    if (selectedLocation) {
      if (selectedLocation.type === "community") {
        setSelectedCommunityId(locationId);
        setSelectedGroupId(undefined);
      } else {
        setSelectedGroupId(locationId);
        setSelectedCommunityId(undefined);
      }
    }
  };

  const handleSubmit = async () => {
    if (!eventName.trim() || !description.trim() || !startDate || !endDate) {
      console.error('Missing required fields');
      return;
    }

    if (eventType === 'in-person' && !location.trim()) {
      console.error('Location is required for in-person events');
      return;
    }

    if (eventType === 'online' && !eventLink.trim()) {
      console.error('Event link is required for online events');
      return;
    }

    setIsUploading(true);

    try {
      let coverImageUrl = null;

      // Upload image if provided
      if (coverImage) {
        const { data: signedUrlData } = await api.post("/upload/signed-url", {
          fileName: coverImage.name,
          fileType: coverImage.type,
        });

        const { signedUrl, path } = signedUrlData.data;

        await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": coverImage.type },
          body: coverImage,
        });

        const { data: publicUrlData } = supabaseAdmin.storage
            .from("images")
            .getPublicUrl(path);

        coverImageUrl = publicUrlData.publicUrl;
      }

      // Prepare event data
      const eventData = {
        title: eventName,
        description,
        startDate,
        endDate,
        location: eventType === 'in-person' ? location : null,
        eventLink: eventType === 'online' ? eventLink : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        coverImage: coverImageUrl,
        isPublic,
        status: 'upcoming',
        eventType,
      };

      // Determine the endpoint based on selected location
      let endpoint = '/events';
      if (selectedCommunityId) {
        endpoint = `/communities/${selectedCommunityId}/events`;
      } else if (selectedGroupId) {
        endpoint = `/groups/${selectedGroupId}/events`;
      }

      // Create event
      await api.post(endpoint, eventData);

      handleModalClose(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-md p-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden h-[80vh] flex flex-col">
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Organize an Event</DialogTitle>
            </DialogHeader>
            <button
                onClick={() => handleModalClose(false)}
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                <input
                    type="file"
                    ref={coverImageRef}
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                {coverImage ? (
                    <>
                      <Image
                          src={URL.createObjectURL(coverImage)}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                      />
                      <button
                          onClick={() => coverImageRef.current?.click()}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      >
                        <Upload className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                ) : (
                    <div className="text-center" onClick={() => coverImageRef.current?.click()}>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">Recommended size: 1200x600px</p>
                    </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name</Label>
                <Input
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your event..."
                    className="mt-1 min-h-24 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Community/Group Selector */}
              <div>
                <Label htmlFor="location-select" className="text-sm font-medium text-gray-700">Organize in</Label>
                <Select
                    value={selectedCommunityId || selectedGroupId || ""}
                    onValueChange={handleLocationSelect}
                    disabled={isLoading}
                >
                  <SelectTrigger className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select community or group"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                    {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} className="hover:bg-gray-100">
                          <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                            loc.type === 'community'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                        }`}>
                          {loc.type}
                        </span>
                            <span>{loc.name}</span>
                          </div>
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
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</Label>
                  <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                        value={eventLink}
                        onChange={(e) => setEventLink(e.target.value)}
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
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    placeholder="Enter maximum attendees"
                    className="mt-1 bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Privacy Setting */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Privacy</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Checkbox
                      id="is-public"
                      checked={isPublic}
                      onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                      className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label htmlFor="is-public" className="text-sm">
                    Make this event public
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with submit button */}
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-3">
              By continuing, you agree with our <span className="text-purple-600 underline cursor-pointer">event's policy</span>
            </div>
            <Button
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-md font-medium disabled:opacity-50"
            >
              {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Event...
                  </>
              ) : (
                  "Organize Event"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default CreateEventModal;