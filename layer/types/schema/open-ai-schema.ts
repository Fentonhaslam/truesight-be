import { z } from 'zod';

export const CVAnalyserSchema = z.object({
  bucketName: z.string(),
  objectKey: z.string(),
});

export const VisionGenerationSchema = z.object({
  threadId: z.string(),
  values: z.array(z.string()),
  feedbackText: z.string().optional(),
})

export const ChatSchema = z.object({
  userId: z.string().optional(),
  option: z.string(),
  message: z.string().optional()
})

export const UserProfilerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  experienceYears: z.string(),
  educationLevel: z.string(),
  educationField: z.string().optional(),
  employmentStatus: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  skills: z.string(),
  professionalInterests: z.string(),
  personalInterests: z.string(),
});

export type UserProfiler = z.infer<typeof UserProfilerSchema>;
export type CVAnalyser = z.infer<typeof CVAnalyserSchema>;
export type VisionGeneration = z.infer<typeof VisionGenerationSchema>;
export type Chat = z.infer<typeof ChatSchema>;