'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { User, Camera, X } from 'lucide-react';
import type { ProfileData } from '../page';

interface ProfilePictureStepProps {
  data: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  onNext: () => void;
}

export default function ProfilePictureStep({ 
  data, 
  onUpdate, 
  onNext 
}: ProfilePictureStepProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // Handle existing profile picture from data
  useEffect(() => {
    if (data.profilePicture instanceof File) {
      const url = URL.createObjectURL(data.profilePicture);
      setPreviewUrl(url);
    }
  }, [data.profilePicture]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      alert('File size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    onUpdate({ profilePicture: file });
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUpdate({ profilePicture: null });
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        {previewUrl ? 'Profile Picture Added' : 'Upload Profile Picture'}
      </h2>
      
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-20 h-20 text-gray-400" />
            )}
          </div>
          
          <label 
            htmlFor="profile-upload" 
            className="absolute bottom-2 right-2 bg-purple-600 p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg"
          >
            <Camera className="w-5 h-5 text-white" />
            <input
              id="profile-upload"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Remove profile picture"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">
          Recommended size: 400x400px (max 5MB)
        </p>
      </div>

      <Button
        onClick={onNext}
        disabled={!previewUrl}
        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {previewUrl ? 'Continue' : 'Skip for Now'}
      </Button>
    </div>
  );
}