'use client';

import { useState, useEffect } from 'react';
import AIVoiceOnboardingModal from './AIVoiceOnboardingModal';
import AIStoreGuardian from './AIStoreGuardian';
import AICopilotDrawer from './AICopilotDrawer';

interface DashboardAIWrapperProps {
  creatorId: string;
  brandName?: string;
  storeLink?: string;
  upiId?: string | null;
  children: React.ReactNode;
}

export default function DashboardAIWrapper({
  creatorId,
  brandName = 'My Store',
  storeLink = '',
  upiId = null,
  children
}: DashboardAIWrapperProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if onboarding is needed (no UPI ID and brandName is default or user hasn't completed setup in session/localStorage)
    const hasSeenOnboarding = typeof window !== 'undefined' ? localStorage.getItem(`onboarded_${creatorId}`) : null;
    
    // Trigger if never onboarded or no UPI ID and brand is default
    if (!hasSeenOnboarding && (!upiId || brandName === 'My Store')) {
      setShowOnboarding(true);
    }
  }, [creatorId, upiId, brandName]);

  const handleOnboardingComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`onboarded_${creatorId}`, 'true');
    }
    setShowOnboarding(false);
    window.location.reload();
  };

  return (
    <>
      {/* 24/7 AI Store Guardian Banner (Only when not onboarding) */}
      {!showOnboarding && <AIStoreGuardian creatorId={creatorId} />}

      {/* Main page content */}
      {children}

      {/* 24/7 AI Floating Voice Copilot */}
      <AICopilotDrawer />

      {/* Automated Voice Onboarding Modal for New Signups */}
      {showOnboarding && (
        <AIVoiceOnboardingModal
          creatorId={creatorId}
          initialBrandName={brandName}
          initialStoreLink={storeLink}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
}
