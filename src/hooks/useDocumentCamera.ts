/**
 * SkillLens AI - useDocumentCamera Hook
 * Implements Section 6 Method B camera capture:
 * - Robust stream binding with video ref callback (fixes null video on tab/intake switch)
 * - Real-time canvas pixel analysis for OpenCV edge detection, brightness, and document presence
 * - Native environment camera with immediate manual capture affordance
 * - Lifecycle stream release on tab background
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export type CameraHint =
  | 'Page detected - Hold steady'
  | 'Move closer to document'
  | 'Too dark - increase lighting'
  | 'Glare detected - adjust angle'
  | 'Align document with guide frame';

export interface UseDocumentCameraOptions {
  onCapture?: (base64Image: string) => void;
}

export function useDocumentCamera(options: UseDocumentCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentHint, setCurrentHint] = useState<CameraHint>('Align document with guide frame');
  const [isStable, setIsStable] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      // Stop any existing stream before starting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // Bind immediately if videoRef is currently mounted
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play().catch(() => {});
      }

      setHasPermission(true);
      setIsActive(true);
      setCurrentHint('Align document with guide frame');
    } catch (err: unknown) {
      const error = err as Error;
      setHasPermission(false);
      setIsActive(false);
      setErrorMessage(
        error.name === 'NotAllowedError'
          ? 'Camera permission was denied. You can enable camera in browser settings, or use the "Take/Upload Photo" option below.'
          : error.message || 'Unable to access camera.'
      );
    }
  }, []);

  // Ref callback to guarantee stream is attached whenever <video> mounts or re-renders
  const bindVideoRef = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      element.setAttribute('playsinline', 'true');
      element.play().catch(() => {});
    }
  }, []);

  // Real-time Computer Vision Frame Analysis (checks brightness & edge contrast)
  useEffect(() => {
    if (!isActive) return;

    let isSubscribed = true;
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 120;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let lastCheckTime = 0;

    const analyzeFrame = (timestamp: number) => {
      if (!isSubscribed) return;

      if (timestamp - lastCheckTime > 300) {
        lastCheckTime = timestamp;
        const video = videoRef.current;

        if (video && video.readyState >= 2 && ctx) {
          ctx.drawImage(video, 0, 0, 160, 120);
          const imgData = ctx.getImageData(20, 20, 120, 80);
          const data = imgData.data;

          let totalBrightness = 0;
          let edgeContrast = 0;
          const pixelCount = data.length / 4;

          for (let i = 0; i < data.length; i += 8) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = (r + g + b) / 3;
            totalBrightness += gray;

            // Simple edge gradient difference with neighbor
            if (i + 12 < data.length) {
              const nextGray = (data[i + 8] + data[i + 9] + data[i + 10]) / 3;
              edgeContrast += Math.abs(gray - nextGray);
            }
          }

          const meanBrightness = totalBrightness / (pixelCount / 2);
          const meanEdge = edgeContrast / (pixelCount / 2);

          if (meanBrightness < 55) {
            setCurrentHint('Too dark - increase lighting');
            setIsStable(false);
          } else if (meanBrightness > 235) {
            setCurrentHint('Glare detected - adjust angle');
            setIsStable(false);
          } else if (meanEdge > 18) {
            setCurrentHint('Page detected - Hold steady');
            setIsStable(true);
          } else if (meanEdge > 8) {
            setCurrentHint('Move closer to document');
            setIsStable(false);
          } else {
            setCurrentHint('Align document with guide frame');
            setIsStable(false);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(analyzeFrame);
    };

    animFrameRef.current = requestAnimationFrame(analyzeFrame);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive]);

  // Tab background visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isActive) stopCamera();
      } else {
        if (hasPermission) startCamera();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
    };
  }, [isActive, hasPermission, startCamera, stopCamera]);

  // Capture current video frame to base64 image
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(base64);
    if (options.onCapture) {
      options.onCapture(base64);
    }
    return base64;
  }, [options]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
    videoRef,
    bindVideoRef,
    isActive,
    hasPermission,
    errorMessage,
    currentHint,
    isStable,
    capturedImage,
    setCapturedImage,
    startCamera,
    stopCamera,
    captureFrame,
    resetCapture,
  };
}
