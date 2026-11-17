/**
 * Google Meet Integration Utility for SkillSwap
 * Ensures direct redirect to Google Meet, releases any local webcam/mic locks
 * so video & audio work seamlessly in Meet, and manages returning back to SkillSwap.
 */

export const GOOGLE_MEET_NEW_URL = 'https://meet.google.com/new';

/**
 * Release any active media tracks so Google Meet has 100% exclusive access
 * to the camera and microphone in Chrome / Windows.
 */
export function releaseMediaDevices() {
  if (typeof window !== 'undefined' && (window as any).__skillswap_media_stream) {
    try {
      const stream = (window as any).__skillswap_media_stream as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      (window as any).__skillswap_media_stream = null;
    } catch (e) {
      console.warn('Error releasing media devices:', e);
    }
  }
}

/**
 * Store the current page as return destination when the user ends the Meet call.
 */
export function setVideoReturnUrl(path?: string) {
  if (typeof window === 'undefined') return;
  const target = path || window.location.pathname + window.location.search;
  // Avoid saving /video as return path to prevent redirect loops
  if (target && !target.startsWith('/video')) {
    localStorage.setItem('skillswap_video_return', target);
  }
}

/**
 * Get the saved return destination or fallback to /home.
 */
export function getVideoReturnUrl(fallback = '/home'): string {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem('skillswap_video_return');
  if (saved && !saved.startsWith('/video')) {
    return saved;
  }
  return fallback;
}

/**
 * Launch Google Meet for a video call.
 * @param options.returnUrl Path to return to after call
 * @param options.directRedirect If true, redirects current tab directly to Google Meet
 */
export function launchGoogleMeet(options?: {
  returnUrl?: string;
  directRedirect?: boolean;
}): Window | null {
  if (typeof window === 'undefined') return null;

  setVideoReturnUrl(options?.returnUrl);
  releaseMediaDevices();

  if (options?.directRedirect) {
    window.location.href = GOOGLE_MEET_NEW_URL;
    return null;
  }

  // Open in new tab/window
  const meetWindow = window.open(GOOGLE_MEET_NEW_URL, '_blank');
  return meetWindow;
}
