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
  onOpenEvent: () => void;
}

type Mode = "default" | "poll";

export const CreatePostModal = ({
  open,
  onOpenChange,
  onOpenEvent,
}: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>([""]);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleAddVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos([...videos, ...Array.from(e.target.files)]);
    }
  };

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ""]);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {mode === "poll" ? "Create Poll" : "Create Post"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" />
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
            />

            {mode === "default" && (
              <>
                {(images.length > 0 || videos.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {images.map((file, index) => (
                      <div
                        key={`image-${index}`}
                        className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs"
                      >
                        {file.name}
                      </div>
                    ))}
                    {videos.map((file, index) => (
                      <div
                        key={`video-${index}`}
                        className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs"
                      >
                        {file.name}
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
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handlePollClick}
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
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
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handlePollOptionChange(index, e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="w-full p-2 border border-gray-200 rounded"
                  />
                ))}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-sm"
                    variant="outline"
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
                      <SelectValue />
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
                      <SelectValue />
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
                disabled={!postContent.trim()}
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