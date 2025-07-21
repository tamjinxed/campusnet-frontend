"use client";

import {useEffect, useRef, useState} from "react";
import {X, Image as ImageIcon, Calendar, BarChart2, Loader2} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle 
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/app/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/app/components/ui/select";
import { useAuth } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import {supabaseAdmin} from "@/app/lib/supabase";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PostLocation {
  id: string;
  name: string;
  type: 'community' | 'group';
}

export const CreatePostModal = ({ open, onOpenChange }: CreatePostModalProps) => {
  const { user } = useAuth();

  // State for the form inputs
  const [postContent, setPostContent] = useState("");
  const [postLocationId, setPostLocationId] = useState<string | undefined>(undefined);
  const [postVisibility, setPostVisibility] = useState<string>("private");

  // State for the dropdown options
  const [locations, setLocations] = useState<PostLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileInputError, setFileInputError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State for selected image files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Ref for the hidden file input ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only fetch data if the modal is open and we haven't already fetched it
    if (open && locations.length === 0) {
      const fetchPostLocations = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch both communities and groups in parallel
          const [communitiesResponse, groupsResponse] = await Promise.all([
            api.get("/communities/my"),
            api.get("/groups/my")
          ]);

          const community = communitiesResponse.data.data.communities;

          // Format the data into a unified structure
          const userCommunity = {
            id: community.id,
            name: community.name,
            type: 'community' as const
          };

          const userGroups = groupsResponse.data.data.groups.map((group: any) => ({
            id: group.id,
            name: group.name,
            type: 'group' as const
          }));

          // Combine them into one list
          setLocations([userCommunity, ...userGroups]);

          // Set a default selected value
          if (userCommunity) {
            setPostLocationId(userCommunity.id);
          }

        } catch (err) {
          console.error("Failed to fetch communities or groups:", err);
          setError("Could not load your communities and groups.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPostLocations();
    }
  }, [open, locations.length]);

  // Function to handle the "Photo" button click
  const handleImageButtonClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  // Function to handle file selection from the dialog
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {

      setFileInputError(null);
      const files = Array.from(event.target.files);

      // TODO: Add validation here (e.g., file type, size, max number of files)
      files.forEach((file: any) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/gif" && file.type !== "image/jpg") {
          setFileInputError("Invalid file type: " + file.type);
        }
      })

      if (files.length > 5) {
        setFileInputError("Maximum 5 images are allowed.");
      }

      const newFiles = files.slice(0, 5 - selectedFiles.length); // Limit to 4 images total
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      setSelectedFiles(prevFiles => prevFiles.slice(0, 5 - prevFiles.length));
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  // Function to remove a selected image preview
  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Reset all component state when the modal is closed
  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPostContent("");
      setSelectedFiles([]);
      setPostLocationId(undefined);
      // We don't reset locations, isLoading, or error to avoid re-fetching if the modal is quickly reopened.
    }
    onOpenChange(isOpen);
  };

  // Handle submission of post data
  const handleSubmit = async () => {
    if ((!postContent.trim() && selectedFiles.length === 0)) return;

    // Set uploading true for button animation
    setIsUploading(true);

    // Holds public image urls
    const uploadedImageUrls: string[] = [];

    try {
      // Upload all selected images to Supabase
      if (selectedFiles.length > 0) {
        await Promise.all(
            selectedFiles.map(async (file) => {
              // Get a signed URL from our backend
              const { data: signedUrlData } = await api.post('/upload/signed-url', {
                fileName: file.name,
                fileType: file.type,
              });

              console.log(signedUrlData);
              const { signedUrl, path } = signedUrlData.data;

              // Upload the file directly to Supabase using the signed URL
              await fetch(signedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
              });

              // Construct the permanent public URL and add it to our list
              const { data: publicUrlData } = supabaseAdmin.storage.from('images').getPublicUrl(path);
              uploadedImageUrls.push(publicUrlData.publicUrl);
            })
        );
      }

      const postIn = locations.find(loc => loc.id === postLocationId);
      const postData =  {
        content: postContent,
        communityId: postIn.type === 'community' ? postLocationId : null,
        groupId: postIn.type === 'group' ? postLocationId : null,
        images: uploadedImageUrls
      }



      // Create the post in our database with the image URLs
      await api.post("/posts", postData);

      handleModalClose(false); // Close and reset on success

    } catch (err) {
      console.error("Failed to create post:", err);
      // You can set an error state here to show a message to the user
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
          </div>
        </DialogHeader>
        

        <div className="px-6 py-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="bg-purple-100 text-purple-600">{`${user.firstName[0]}${user.lastName[0]}`}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
              <p className="text-sm text-gray-600">{user.universityName}</p>
            </div>
          </div>
 
          <div className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind..."
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            {/* --- Image Preview Grid --- */}
            {fileInputError && (
                <div className="text-red-600">
                  {fileInputError}
                </div>
            )}

            {!fileInputError && (
                <>
                  {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <img
                                  src={URL.createObjectURL(file)} // Create a temporary URL for preview
                                  alt={`preview ${index}`}
                                  className="w-full h-24 object-cover rounded-lg"
                                  // Revoke the object URL when the component unmounts to prevent memory leaks
                                  onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                              />
                              <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 hover:bg-opacity-75"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                        ))}
                      </div>
                  )}
                </>
            )}

            <div className="flex items-center justify-between py-3 border-y border-gray-200">
              <div className="flex items-center gap-6">
                <button 
                  type="button"
                  onClick={handleImageButtonClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-sm">Photo</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Event</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <BarChart2 className="w-5 h-5" />
                  <span className="text-sm">Poll</span>
                </button>
              </div>
            </div>

            {/* --- Hidden file input element --- */}
            <input
                type="file"
                name="images"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple // Allow selecting multiple files
                accept="image/png, image/jpeg, image/gif, image/jpg" // Specify accepted file types
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Visibility:</span>
                  <Select
                      defaultValue="private"
                      onValueChange={(value) => setPostVisibility(value)}
                  >
                    <SelectTrigger className="w-28 h-8 border border-gray-300 bg-white shadow-sm hover:bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      <SelectItem value="private" className="hover:bg-gray-100 focus:bg-gray-100">
                        Private
                      </SelectItem>
                      <SelectItem value="public" className="hover:bg-gray-100 focus:bg-gray-100">
                        Public
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Post On:</span>
                  <Select
                      value={postLocationId}
                      onValueChange={(value) => setPostLocationId(value)}
                  >
                    <SelectTrigger className="w-48 h-8 border border-gray-300 bg-white shadow-sm hover:bg-white">
                      <SelectValue placeholder={isLoading ? "Loading..." : "Select a location"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      {isLoading && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                      {error && <SelectItem value="error" disabled>{error}</SelectItem>}

                      {!isLoading && !error && (
                          <>
                            {locations.length > 0 && (
                                locations.map((loc) => (
                                      <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                      </SelectItem>
                                  ))
                              )}
                          </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={isUploading || (!postContent.trim() && selectedFiles.length === 0)}
                    className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  {isUploading ? <Loader2 className="animate-spin mr-2" /> : null}
                  {isUploading ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};