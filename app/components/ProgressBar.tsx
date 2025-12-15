'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <div className="text-sm text-gray-400 mb-2">Progress</div>
      <div className="text-xl font-bold">{currentStep + 1} / {totalSteps}</div>
      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
        <div 
          className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}