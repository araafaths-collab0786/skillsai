import { z } from 'zod';

export const userRoleSchema = z.enum(['job_seeker', 'recruiter', 'career_counselor']);

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  next: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Section 8 open-redirect hardening: same-origin relative path starting with single "/"
      return val.startsWith('/') && !val.startsWith('//') && !val.includes('\\');
    }, 'Invalid redirect destination'),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must include at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: userRoleSchema.default('job_seeker'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const cropPointSchema = z.object({
  x: z.number().min(0),
  y: z.number().min(0),
});

export const cameraIntakePayloadSchema = z.object({
  submissionId: z.string().uuid('Invalid submission ID format'),
  intakeMethod: z.literal('camera_capture'),
  base64Image: z.string().min(100, 'Image data is required'),
  cropCorners: z.array(cropPointSchema).length(4, 'Exactly 4 crop corners required'),
  deviceOrientation: z.enum(['portrait', 'landscape']).default('portrait'),
});

export const pdfIntakePayloadSchema = z.object({
  submissionId: z.string().uuid('Invalid submission ID format'),
  intakeMethod: z.literal('pdf_upload'),
});

export const matchRequestSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
});

export const gapAnalysisRequestSchema = z.object({
  resumeId: z.string().min(1, 'Resume ID is required'),
  jobId: z.string().min(1, 'Job ID is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CameraIntakePayload = z.infer<typeof cameraIntakePayloadSchema>;
export type MatchRequestInput = z.infer<typeof matchRequestSchema>;
export type GapAnalysisRequestInput = z.infer<typeof gapAnalysisRequestSchema>;
