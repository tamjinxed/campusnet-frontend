'use client'

import { Heart, MessageSquare, Share, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"

interface FeedPostProps {
  name: string
  role: string
  time: string
  content: string
  likes: number
  comments: number
  avatarFallback: string
}

export function FeedPost({
  name = "John Doe",
  role = "Student of AICD University, Bangladesh",
  time = "5 min",
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  likes = 100,
  comments = 5,
  avatarFallback = "JD"
}: FeedPostProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt={`${name}'s avatar`} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-gray-600">{role}</p>
              <p className="text-xs text-gray-500">{time}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 mb-4">{content}</p>
          
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <img 
              src="/placeholder-post.jpg" 
              alt="Post content" 
              className="w-full h-48 object-cover rounded opacity-80"
              width={500}
              height={300}
            />
            <div className="absolute bottom-2 left-2 text-white text-sm">
              {likes} Likes
            </div>
            <div className="absolute bottom-2 right-2 text-white text-sm">
              {comments} comments
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
  )
}