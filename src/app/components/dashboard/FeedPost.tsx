"use client";

import { Heart, MessageSquare, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

const FeedPost = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-purple-100 text-purple-600">JD</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">John Doe</h4>
              <p className="text-sm text-gray-600">Student of AICD University, Bangladesh</p>
              <p className="text-xs text-gray-500">5 min</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <div className="bg-gray-900 rounded-lg p-4 relative">
            <img
              src="/placeholder.svg"
              alt="Code screenshot"
              className="w-full h-48 object-cover rounded opacity-80"
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">
              100 Likes
            </div>
            <div className="absolute bottom-2 right-2 text-white text-sm">
              5 comments
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-blue-600">
            <Heart className="w-4 h-4" />
            <span>Liked</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedPost;
