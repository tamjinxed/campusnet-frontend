"use client";

import { Heart, MessageSquare, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import timeCalc from "@/app/utils/timeCalc";

const FeedPost = ({ post }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorProfilePicture} />
              <AvatarFallback className="bg-purple-100 text-purple-600">{post.authorFirstName[0]}{post.authorLastName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{post.authorFirstName} {post.authorLastName}</h4>
              <p className="text-xs text-gray-600">{post.authorUniversity}, {post.authorUniversityCountry}</p>
              <p className="text-xs text-gray-500">{timeCalc(post["approved_at"])}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-gray-800 mb-4">
            {post.content}
          </p>

          <div className="rounded-lg rounded">
            {post.images && post.images.length > 0 && (
                <>
                {post.images.map((image, index) => (
                    <img
                        key={image}
                        src="https://ystvgbzmyeoqbghbhooq.supabase.co/storage/v1/object/images/images/27872ef2-3fac-4b5a-8d28-7298f8be263a/cat-1753058137599.png"
                        alt="Uploaded image"
                        className="w-full h-48 object-cover"
                    />
                ))}
                </>
            )}
          </div>
        </div>

        <div>

          <div className="flex items-center justify-between pl-1 pr-1 mb-1">

            <div className="bottom-2 left-2 text-gray-900 text-sm">
              {post["like_count"]} likes
            </div>
            <div className="bottom-2 right-2 text-gray-900 text-sm">
              {post["comment_count"]} comments
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t">
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

        </div>

      </CardContent>
    </Card>
  );
};

export default FeedPost;
