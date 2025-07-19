"use client";

import { useState } from "react";
import { X, Image as ImageIcon, BarChart2, XCircle, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenEvent?: () => void; // Made optional since it's not used in the component
}

type Mode = "default" | "poll";

interface FileWithPreview extends File {
  preview?: string;
}

export const CreatePostModal = ({
  open,
  onOpenChange,
}: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [videos, setVideos] = useState<FileWithPreview[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>([""]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }));
      setImages([...images, ...newFiles]);
    }
  };

  const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        ...file,
        preview: URL.createObjectURL(file)
      }));
      setVideos([...videos, ...newFiles]);
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) { // Limit to 4 options
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handlePollClick = () => {
    setMode("poll");
    setImages([]);
    setVideos([]);
  };

  const handleCancelPoll = () => {
    setMode("default");
    setPollOptions([""]);
  };

  // Clean up object URLs
  const revokeObjectUrls = () => {
    images.forEach(image => image.preview && URL.revokeObjectURL(image.preview));
    videos.forEach(video => video.preview && URL.revokeObjectURL(video.preview));
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        revokeObjectUrls();
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {mode === "poll" ? "Create Poll" : "Create Post"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => {
                revokeObjectUrls();
                onOpenChange(false);
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" alt="User avatar" />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600">
                ABCD University, Bangladesh
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={
                mode === "poll"
                  ? "Ask a question for your poll..."
                  : "What's on your mind..."
              }
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-label="Post content"
            />

            {mode === "default" && (
              <>
                {(images.length > 0 || videos.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((file, index) => (
                      <div
                        key={`image-${index}`}
                        className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs"
                      >
                        {file.type.startsWith('image/') && file.preview ? (
                          <img 
                            src={file.preview} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          file.name
                        )}
                      </div>
                    ))}
                    {videos.map((file, index) => (
                      <div
                        key={`video-${index}`}
                        className="relative w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs"
                      >
                        {file.type.startsWith('video/') ? (
                          <video className="w-full h-full object-cover">
                            <source src={file.preview} type={file.type} />
                          </video>
                        ) : (
                          file.name
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-y border-gray-200">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-sm">Photo</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleAddImage}
                        className="hidden"
                        aria-label="Upload images"
                      />
                    </label>

                    <label className="flex items-center gap-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                      <Video className="w-5 h-5" />
                      <span className="text-sm">Video</span>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleAddVideo}
                        className="hidden"
                        aria-label="Upload videos"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handlePollClick}
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                      aria-label="Create poll"
                    >
                      <BarChart2 className="w-5 h-5" />
                      <span className="text-sm">Poll</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === "poll" && (
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handlePollOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 p-2 border border-gray-200 rounded"
                      aria-label={`Poll option ${index + 1}`}
                    />
                    {pollOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...pollOptions];
                          updated.splice(index, 1);
                          setPollOptions(updated);
                        }}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-sm"
                    variant="outline"
                    disabled={pollOptions.length >= 4}
                  >
                    Add Option
                  </Button>
                  <button
                    type="button"
                    onClick={handleCancelPoll}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Poll
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Visibility:</span>
                  <Select defaultValue="private">
                    <SelectTrigger className="w-28 h-8 border border-gray-300 bg-white shadow-sm">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Post On:</span>
                  <Select defaultValue="abc-community">
                    <SelectTrigger className="w-48 h-8 border border-gray-300 bg-white shadow-sm">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      <SelectItem value="abc-community">
                        ABC University Community
                      </SelectItem>
                      <SelectItem value="timeline">My Timeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                disabled={!postContent.trim() || (mode === "poll" && pollOptions.some(opt => !opt.trim()))}
                className="bg-purple-700 hover:bg-purple-700 text-white px-6 rounded-full"
              >
                {mode === "poll" ? "Post Poll" : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};