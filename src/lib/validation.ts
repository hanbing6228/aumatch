import { z } from "zod";

// Shared input schemas — used by API routes and (mirrored) by client forms.

const phoneUS = z
  .string()
  .trim()
  .regex(/^\d{3}-\d{3}-\d{4}$/, "Use format XXX-XXX-XXXX");

const SERVICE = z.enum(["CHILDCARE", "ESTATE", "CLEANING", "OTHER"]);
const LOCATIONS = [
  "Cary",
  "Raleigh",
  "Durham",
  "Chapel Hill",
  "Apex",
  "Morrisville",
  "Other",
] as const;

// ── Employer intake (Find a Caregiver) ──
export const employerLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter 2–50 characters").max(50),
  phone: phoneUS,
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  location: z.enum(LOCATIONS),
  services: z.array(SERVICE).min(1, "Please select at least one service"),
  frequency: z.string().trim().max(40).optional().or(z.literal("")),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  locale: z.enum(["en", "zh"]).default("en"),
});
export type EmployerLeadInput = z.infer<typeof employerLeadSchema>;

// ── Provider application (Join as Provider) ──
export const providerApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter 2–50 characters").max(50),
  phone: phoneUS,
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  city: z.string().trim().min(2, "This field is required").max(80),
  availability: z.string().trim().max(40).optional().or(z.literal("")),
  expectedRate: z.string().trim().max(80).optional().or(z.literal("")),
  documentUrl: z.string().trim().url().optional().or(z.literal("")),
  documentName: z.string().trim().max(255).optional().or(z.literal("")),
  consentBgCheck: z
    .boolean()
    .refine((v) => v === true, "You must consent to proceed"),
  locale: z.enum(["en", "zh"]).default("en"),
});
export type ProviderApplicationInput = z.infer<typeof providerApplicationSchema>;

// ── Consultation booking ──
export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter 2–50 characters").max(50),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  topic: z.string().trim().max(40).optional().or(z.literal("")),
  startTime: z.string().trim().optional().or(z.literal("")),
  locale: z.enum(["en", "zh"]).default("en"),
});
export type BookingInput = z.infer<typeof bookingSchema>;

// ── Auth ──
export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  portalRole: z.enum(["family", "provider"]).default("family"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;
