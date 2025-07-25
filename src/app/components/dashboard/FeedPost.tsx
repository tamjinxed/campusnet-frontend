"use client";

import { Heart, MessageSquare, Share, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import timeCalc from "@/app/utils/timeCalc";
import { useAuth } from "@/app/context/AuthContext";
import {useEffect, useMemo, useRef, useState} from "react";
import api from "@/app/lib/axios";
import {Dialog, DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {DialogHeader} from "@/app/components/ui/dialog";
import {Textarea} from "@/app/components/ui/textarea";


const FeedPost = ({ post, onPostUpdate }) => {
  const { user } = useAuth();

  // State for reaction, like and isLiking  animation
  const [reactions, setReactions] = useState(post.reactions);
  const [reactionCount, setReactionCount] = useState(post.reactionCount);
  const [userReaction, setUserReaction] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  // Find the initial reaction based on props
  const initialUserReaction = useMemo(() => {
    if (!user?.userId || !post.reactions?.length) return null;
    return post.reactions.find(reaction => reaction.userId === user.userId) || null;
  }, [post.reactions, user?.userId]);

  const [isReacted, setIsReacted] = useState(!!initialUserReaction);

  // Derive userReaction and isLiked from reactions and user
  useEffect(() => {
    if (!user?.userId || !reactions?.length) setUserReaction(null);
    const findReaction = reactions.find(reaction => reaction.userId === user.userId) || null;
    setUserReaction(findReaction);
    setIsReacted(!!findReaction);
  }, []);

  // Comment modal state
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Refs
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // API URLs - Replace these with your actual endpoints
  const API_ENDPOINTS = {
    LIKE: `/posts/${post.id}/reactions`,
    COMMENTS: `/posts/${post.id}/comments`
  };

  // Like/Unlike functionality
  const handleLike = async () => {
    if (isLiking) return;

    // For animation and disabling button set isLiking true
    setIsLiking(true);

    // Store previous state for rollback
    const previousState = {
      isLiked: isReacted,
      prevReactions: [...reactions],
      likeCount: reactionCount
    };

    try {
      // Change reaction count
      setReactionCount(prev => isReacted ? prev - 1 : prev + 1);

      // If user already reacted, delete reaction
      // Else add reaction
      if (isReacted) {
        const {data: {data}} = await api.delete(API_ENDPOINTS.LIKE + `/${userReaction.id}`);

        setReactions(prevReactions => prevReactions.filter(reaction => reaction.id !== data.reaction.id));
        setUserReaction(null);
        setIsReacted(false);
      } else {
        const { data: { data } } = await api.post(API_ENDPOINTS.LIKE, {
          reactionType: 'like'
        });

        setUserReaction(data.reaction);
        setIsReacted(true);
        setReactions(prevReactions => {
          return [...prevReactions, data.reaction];
        });
      }

      // Notify parent component if needed
      onPostUpdate?.(post.id, {
        isLiked: !isReacted,
        like_count: isReacted ? reactionCount - 1 : reactionCount + 1
      });

    } catch (error) {
      // Revert on error
      setIsReacted(previousState.isLiked);
      setReactionCount(previousState.likeCount);
      setReactions(previousState.prevReactions);
      console.error("Failed to update like:", error);
    } finally {
      setIsLiking(false);
    }
  };

    // Load comments when modal opens
    const handleCommentClick = async () => {
      setIsCommentModalOpen(true);
      if (comments.length === 0) {
        await loadComments();
      }
      // Focus comment input after modal opens
      setTimeout(() => commentInputRef.current?.focus(), 100);
    };

    const loadComments = async () => {
      setIsLoadingComments(true);
      try {
        const response = await api.get(API_ENDPOINTS.COMMENTS);
        setComments(response.data.data.comments || []);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    // Submit new comment
    const handleSubmitComment = async () => {
      if (!newComment.trim() || isSubmittingComment) return;

      setIsSubmittingComment(true);
      try {
        const { data : { data } } = await api.post(API_ENDPOINTS.COMMENTS, {
          content: newComment.trim()
        });

        const newCommentData = data.comment;
        setComments(prev => [newCommentData, ...prev]);
        setCommentCount(prev => prev + 1);
        setNewComment("");

        // Notify parent component
        onPostUpdate?.(post.id, { comment_count: commentCount + 1 });

      } catch (error) {
        console.error("Failed to submit comment:", error);
      } finally {
        setIsSubmittingComment(false);
      }
    };

  return (<>
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
                        src={image}
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
              {reactionCount} likes
            </div>
            <div className="bottom-2 right-2 text-gray-900 text-sm">
              {commentCount} comments
            </div>

          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${isReacted ? 'text-red-600' : 'text-gray-600'} hover:text-red-600`}
                onClick={handleLike}
                disabled={isLiking}
            >
              <Heart className={`w-4 h-4 ${isReacted ? 'fill-current' : ''}`} />
              <span>{isReacted ? 'Liked' : 'Like'}</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                onClick={handleCommentClick}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comment</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
                // onClick={handleShareClick}
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

        </div>

      </CardContent>
    </Card>

    {/* Comments Modal */}
    <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoadingComments ? (
              <div className="text-center py-4 text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>
          ) : (
              comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.profilePicture} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                        {comment?.firstName[0]}{comment?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{comment?.firstName} {comment?.lastName}</span>
                        <span className="text-xs text-gray-500">{timeCalc(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
              ))
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
              />
              <div className="flex justify-end">
                <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800"
                >
                  {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
      </>
  );
};

export default FeedPost;
