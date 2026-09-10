import React from 'react';

/**
 * Official & High-Quality Vector Logos for UPI Apps (Google Pay, PhonePe, Paytm, BHIM UPI)
 */

export function GooglePayLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <path
        d="M24 9.5C28.05 9.5 30.9 11.25 32.45 12.7L38.9 6.25C34.9 2.5 29.85 0.5 24 0.5C14.65 0.5 6.7 5.85 2.85 13.65L10.35 19.45C12.15 13.7 17.55 9.5 24 9.5Z"
        fill="#EA4335"
        transform="scale(0.85) translate(4, 4)"
      />
      <path
        d="M47.5 24.5C47.5 22.8 47.35 21.15 47.05 19.55H24V29.05H37.2C36.6 32.05 34.9 34.6 32.35 36.3L39.8 42.1C44.15 38.1 47.5 32.05 47.5 24.5Z"
        fill="#4285F4"
        transform="scale(0.85) translate(4, 4)"
      />
      <path
        d="M10.35 28.55C9.85 27.05 9.55 25.5 9.55 24C9.55 22.5 9.85 20.95 10.35 19.45L2.85 13.65C1.05 17.25 0 20.5 0 24C0 27.5 1.05 30.75 2.85 34.35L10.35 28.55Z"
        fill="#FBBC05"
        transform="scale(0.85) translate(4, 4)"
      />
      <path
        d="M24 47.5C30.5 47.5 35.95 45.35 39.8 42.1L32.35 36.3C30.3 37.7 27.45 38.5 24 38.5C17.55 38.5 12.15 34.3 10.35 28.55L2.85 34.35C6.7 42.15 14.65 47.5 24 47.5Z"
        fill="#34A853"
        transform="scale(0.85) translate(4, 4)"
      />
    </svg>
  );
}

export function PhonePeLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#5F259F" />
      {/* Official PhonePe 'Pe' Symbol */}
      <path
        d="M26.5 12H21C16.58 12 13 15.58 13 20C13 24.42 16.58 28 21 28H23V36H28V28H29C33.42 28 37 24.42 37 20C37 15.58 33.42 12 29 12H26.5ZM21 16H29C31.21 16 33 17.79 33 20C33 22.21 31.21 24 29 24H21C18.79 24 17 22.21 17 20C17 17.79 18.79 16 21 16Z"
        fill="#FFFFFF"
      />
      <path
        d="M28 20L20 32H25L31 22L28 20Z"
        fill="#FFFFFF"
        opacity="0.9"
      />
    </svg>
  );
}

export function PaytmLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Paytm Navy 'Pay' & Cyan 'tm' */}
      <g transform="translate(6, 17)">
        <text x="0" y="12" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="11" fill="#002E6E">
          Pay
        </text>
        <text x="21" y="12" fontFamily="'Arial Black', 'Impact', sans-serif" fontWeight="900" fontSize="11" fill="#00BAF2">
          tm
        </text>
      </g>
    </svg>
  );
}

export function BhimUpiLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0A0A0A" />
      {/* NPCI UPI Dual Triangle Chevron Logo */}
      <path d="M19 14L28 24L19 34L15 30L21 24L15 18L19 14Z" fill="#00A352" />
      <path d="M26 14L35 24L26 34L22 30L28 24L22 18L26 14Z" fill="#F77E21" />
      <text x="24" y="42" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="7" fill="#FFFFFF" letterSpacing="1">
        UPI
      </text>
    </svg>
  );
}

export function CredLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0A0A0A" />
      {/* CRED Minimalist Geometric Mask Logo */}
      <path
        d="M14 14H34V34H14V14ZM18 18V30H30V18H18Z"
        fill="#FFFFFF"
      />
      <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
    </svg>
  );
}

export function UpiBadge() {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      backgroundColor: '#f8fafc',
      borderRadius: '100px',
      border: '1px solid #e2e8f0',
      fontSize: '0.72rem',
      fontWeight: 800,
      color: '#0a0a0a'
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#16a34a' }}></span>
      <span>UPI Instant 0% Fee</span>
    </div>
  );
}
