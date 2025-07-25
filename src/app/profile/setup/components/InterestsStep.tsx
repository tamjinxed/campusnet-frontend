'use client';

import { useState, KeyboardEvent } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { X } from 'lucide-react';
import type { ProfileData } from '../page';

interface InterestsStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function InterestsStep({ 
  data, 
  onUpdate, 
  onNext, 
  onBack 
}: InterestsStepProps) {
  const [interests, setInterests] = useState<string[]>(data.interests || []);
  const [currentInterest, setCurrentInterest] = useState('');

  const addInterest = () => {
    const trimmedInterest = currentInterest.trim();
    if (trimmedInterest && !interests.includes(trimmedInterest)) {
      setInterests(prev => [...prev, trimmedInterest]);
      setCurrentInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleNext = () => {
    onUpdate({ interests });
    onNext();
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900 text-center">
        Select your interests
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={currentInterest}
            onChange={(e) => setCurrentInterest(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Add an interest..."
            className="h-12 flex-1"
          />
          <Button 
            onClick={addInterest} 
            variant="outline" 
            className="h-12 px-6"
            disabled={!currentInterest.trim()}
          >
            Add
          </Button>
        </div>

        {interests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge 
                key={interest} 
                variant="secondary" 
                className="px-3 py-1 text-sm flex items-center gap-1"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  aria-label={`Remove ${interest}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Add interests to help us personalize your experience
          </p>
        )}
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
          disabled={interests.length === 0}
          className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Next
        </Button>
      </div>
    </div>
  );
}