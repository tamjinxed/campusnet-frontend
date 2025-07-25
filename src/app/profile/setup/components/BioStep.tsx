'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import type { ProfileData } from "../page";

interface BioStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function BioStep({ data, onUpdate, onNext, onBack }: BioStepProps) {
  const [bio, setBio] = useState(data.bio || "");
  const maxLength = 150;

  const handleNext = () => {
    onUpdate({ bio });
    onNext();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 text-center">Write your bio</h2>
      
      <div className="space-y-2">
        <Label htmlFor="bio" className="sr-only">
          Bio
        </Label>
        <div className="relative">
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell others about yourself..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={maxLength}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {bio.length}/{maxLength}
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
}