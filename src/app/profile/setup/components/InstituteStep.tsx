'use client';

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { ProfileData } from "../page";

interface InstituteStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function InstituteStep({ 
  data, 
  onUpdate, 
  onNext, 
  onBack 
}: InstituteStepProps) {
  const [university, setUniversity] = useState(data.university || "");
  const [degree, setDegree] = useState(data.degree || "");
  const [year, setYear] = useState(data.year || "");
  const [major, setMajor] = useState(data.major || "");

  const handleNext = () => {
    onUpdate({ university, degree, year, major });
    onNext();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        Tell us about your current institute
      </h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="university">
            University
          </Label>
          <Input
            id="university"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="Enter your university"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="degree">
            Degree
          </Label>
          <Input
            id="degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="e.g., Bachelor's, Master's"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">
            Year
          </Label>
          <Input
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g., 1st year, 2nd year"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">
            Major
          </Label>
          <Input
            id="major"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Your field of study"
            className="h-12"
          />
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
          disabled={!university || !degree || !year || !major}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
}