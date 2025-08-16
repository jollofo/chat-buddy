import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  gdpr: z.boolean().default(false),
  utm: z.record(z.string()).optional()
});

export const LiveEventSchema = z.object({
  event: z.object({
    id: z.string(),
    type: z.string(),
    created_at: z.number(),
    author_id: z.string().optional(),
    properties: z.record(z.any()).optional(),
    text: z.string().optional()
  }),
  chat: z.object({
    id: z.string(),
    users: z.array(z.any()).optional()
  }).optional(),
  customer: z.any().optional()
});