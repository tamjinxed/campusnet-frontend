'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import type { ProfileData } from '../page';

interface PersonalInfoStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalInfoStep({ 
  data, 
  onUpdate, 
  onNext, 
  onBack 
}: PersonalInfoStepProps) {
  const [gender, setGender] = useState(data.gender || '');
  const [dateOfBirth, setDateOfBirth] = useState(data.dateOfBirth || '');

  const handleNext = () => {
    onUpdate({ gender, dateOfBirth });
    onNext();
  };

  // Calculate minimum and maximum dates for date picker (e.g., 13-100 years old)
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 100);
  const maxDate = new Date();
  maxDate.setFullYear(currentDate.getFullYear() - 13);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        Personal Information
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="block text-sm font-medium mb-2">
            Gender
          </Label>
          <RadioGroup 
            value={gender} 
            onValueChange={setGender} 
            className="flex gap-6"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
              <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob" className="block text-sm font-medium mb-2">
            Date of Birth
          </Label>
          <Input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            min={minDate.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
            className="h-12"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You must be at least 13 years old
          </p>
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
          disabled={!gender || !dateOfBirth}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
}