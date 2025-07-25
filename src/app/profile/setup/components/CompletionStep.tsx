'use client';

import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { ProfileData } from "../page";

interface CompletionStepProps {
  data: ProfileData;
  onNext: () => void;
}

export default function CompletionStep({ data, onNext }: CompletionStepProps) {
  return (
    <div className="text-center space-y-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-purple-600" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Profile Setup Done</h2>
        <div className="space-y-2 text-gray-600">
          <p>Your profile has been successfully set up.</p>
          <p className="text-sm">Let's get started with your campus community!</p>
        </div>
      </div>

      <Link href="/communities" legacyBehavior passHref>
        <Button 
          onClick={onNext}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          Next
        </Button>
      </Link>
    </div>
  );
}