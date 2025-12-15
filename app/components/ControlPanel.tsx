'use client';

import React from 'react';

interface ControlPanelProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
}

export default function ControlPanel({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        disabled={currentStep >= totalSteps - 1}
        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg transition"
      >
        Next →
      </button>
      <button
        onClick={onReset}
        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
      >
        Reset All
      </button>
    </div>
  );
}