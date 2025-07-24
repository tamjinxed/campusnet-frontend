"use client";

import { useState, useRef } from "react";
import {X, Upload, User, Loader2} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import api from "@/app/lib/axios";
import {supabaseAdmin} from "@/app/lib/supabase";
import {useAuth} from "@/app/context/AuthContext";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateGroupModal = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const { user } = useAuth();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [newMemberApprovalRequired, setNewMemberApprovalRequired] = useState(true);
  const [newPostApprovalRequired, setNewPostApprovalRequired] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const handleModalClose = (open) => {
    if (!open) {
      setGroupName("");
      setDescription("");
      setRules("");
      setCoverPhoto(null);
      setProfilePhoto(null);
      setNewMemberApprovalRequired(true);
      setNewPostApprovalRequired(true);
    }
    onOpenChange(open);
  }

  const handleSubmit = async () => {
    if (!groupName.trim() && !profilePhoto) {
      return;
    }

    setIsUploading(true);

    const allImages = [coverPhoto, profilePhoto];
    const uploadedImageUrls: string[] = [];

    try {
      await Promise.all(
       allImages.map(async (image) => {
         const { data : signedUrlData } = await api.post("/upload/signed-url", {
           fileName: image?.name,
           fileType: image?.type,
         });

         const { signedUrl, path } = signedUrlData.data;

         await fetch(signedUrl, {
           method: "PUT",
           headers: { "Content-Type": image.type },
           body: image,
         });

         const { data: publicUrlData } = supabaseAdmin.storage
             .from("images")
             .getPublicUrl(path);
         uploadedImageUrls.push(publicUrlData.publicUrl);
       })
      );

      const groupPostData = {
        name: groupName,
        description: description,
        rules: rules,
        coverImage: uploadedImageUrls[0],
        logo: uploadedImageUrls[1],
        memberApprovalRequired: newMemberApprovalRequired,
        postApprovalRequired: newPostApprovalRequired,
      }

      const { data: { data : { communities } } } = await api.get("/communities/my");

      await api.post(`/communities/${communities.id}/groups`, groupPostData);

      handleModalClose(false);
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setIsUploading(false);
    }
  }

  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/jpg"
    ) {
      console.log("Invalid file type: " + file.type);
    }

    if (file) {
      setCoverPhoto(file);
    }
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/jpg"
    ) {
      console.log("Invalid file type: " + file.type);
    }

    if (file) {
      setProfilePhoto(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-lg border border-gray-200 shadow-xl">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create Group</h2>
          </div>
        </DialogHeader>

        <div className="flex bg-white rounded-b-lg">
          <div className="flex-1 px-6 py-4 space-y-6">
            {/* Wrapper for Cover + Profile */}
            <div className="relative w-full">
              {/* Cover Photo */}
              <div className="h-40 w-full rounded-t-lg overflow-hidden bg-gray-200 relative">
                <input
                  type="file"
                  ref={coverPhotoRef}
                  onChange={handleCoverPhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
                {coverPhoto ? (
                  <Image
                    src={URL.createObjectURL(coverPhoto)}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-gray-500 cursor-pointer"
                    onClick={() => coverPhotoRef.current?.click()}
                  >
                    Click to Upload Cover Photo
                  </div>
                )}

                {/* Cover Edit Button */}
                <button
                  onClick={() => coverPhotoRef.current?.click()}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Photo */}
              <div
                className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white bg-gray-100 overflow-hidden cursor-pointer shadow-md z-10"
                onClick={() => profilePhotoRef.current?.click()}
              >
                {profilePhoto ? (
                  <Image
                    src={URL.createObjectURL(profilePhoto)}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400 m-auto mt-6" />
                )}
                <input
                  type="file"
                  ref={profilePhotoRef}
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Add margin below floating profile image */}
            <div className="mt-16" />

            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className="w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what your group is about"
                className="w-full min-h-[100px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rules</label>
              <Textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Set some ground rules for your group"
                className="w-full min-h-[100px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Privacy</label>
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-members"
                    checked={newMemberApprovalRequired}
                    onChange={() => setNewMemberApprovalRequired(pastMemberApproval => !pastMemberApproval)}
                    className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label htmlFor="allow-members" className="text-sm">
                    New members need admin approval
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allow-users"
                    checked={newPostApprovalRequired}
                    onChange={() => setNewPostApprovalRequired(pastPostApproval => !pastPostApproval)}
                    className="border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label htmlFor="allow-users" className="text-sm">
                    New posts needs admin review
                  </label>
                </div>
              </div>
            </div>

            {/*/!* Welcome Note *!/*/}
            {/*<div className="space-y-2">*/}
            {/*  <label className="text-sm font-medium">Welcome Note</label>*/}
            {/*  <Textarea*/}
            {/*    value={welcomeNote}*/}
            {/*    onChange={(e) => setWelcomeNote(e.target.value)}*/}
            {/*    placeholder="Write a welcome message for new members"*/}
            {/*    className="w-full min-h-[100px] resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"*/}
            {/*  />*/}
            {/*</div>*/}

            <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              {isUploading ? (
                  <Loader2 className="w-5 h-5 mr-2 -ml-1 animate-spin" />
              ) : null}
              {isUploading ? "Creating Group" : "Create Group"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
