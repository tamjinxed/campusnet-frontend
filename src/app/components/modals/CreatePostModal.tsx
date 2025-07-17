"use client";

import { useState } from "react";
import { X, Image as ImageIcon, Calendar, BarChart2 } from "lucide-react";
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
import TiptapEditor from "@/app/components/editor/TiptapEditor";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreatePostModal = ({ open, onOpenChange }: CreatePostModalProps) => {
  const [postContent, setPostContent] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0 rounded-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Post</DialogTitle>
          </div>
        </DialogHeader>
        

        <div className="px-6 py-4">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-purple-100 text-purple-600">JD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600">ABCD University, Bangladesh</p>
            </div>
          </div>
 
          <div className="space-y-4">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind..."
              className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <div className="flex items-center justify-between py-3 border-y border-gray-200">
              <div className="flex items-center gap-6">
                <button 
                  type="button"
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Visibility:</span>
                  <Select defaultValue="private">
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
                      <SelectItem value="friends" className="hover:bg-gray-100 focus:bg-gray-100">
                        Friends
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Post On:</span>
                  <Select defaultValue="abc-community">
                    <SelectTrigger className="w-48 h-8 border border-gray-300 bg-white shadow-sm hover:bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 shadow-md">
                      <SelectItem value="abc-community" className="hover:bg-gray-100 focus:bg-gray-100">
                        ABC University Community
                      </SelectItem>
                      <SelectItem value="timeline" className="hover:bg-gray-100 focus:bg-gray-100">
                        My Timeline
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                disabled={!postContent.trim()}
                className="bg-purple-700 hover:bg-purple-700 text-white px-6 rounded-full"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};