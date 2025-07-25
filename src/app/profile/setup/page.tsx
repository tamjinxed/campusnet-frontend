'use client';

import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { Progress } from '@/app/components/ui/progress';
import ProfilePictureStep from './components/ProfilePictureStep';
import PersonalInfoStep from './components/PersonalInfoStep';
import BioStep from './components/BioStep';
import InstituteStep from './components/InstituteStep';
import InterestsStep from './components/InterestsStep';
import CompletionStep from './components/CompletionStep';

export interface ProfileData {
  profilePicture?: File | null;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  university?: string;
  degree?: string;
  year?: string;
  major?: string;
  interests?: string[];
}

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({});
  
  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfilePictureStep
            data={profileData}
            onUpdate={updateProfileData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            data={profileData}
            onUpdate={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <BioStep
            data={profileData}
            onUpdate={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <InstituteStep
            data={profileData}
            onUpdate={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <InterestsStep
            data={profileData}
            onUpdate={updateProfileData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <CompletionStep
            data={profileData}
            onNext={handleNext}  // Changed from onComplete to onNext
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-lg">
          <div className="text-left mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Setup</h1>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              {currentStep < totalSteps && (
                <button 
                  onClick={() => setCurrentStep(totalSteps)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Skip
                </button>
              )}
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}