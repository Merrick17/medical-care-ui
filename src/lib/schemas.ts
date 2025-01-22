import * as z from "zod"

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
  ),
})

export const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
    "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
  ),
  role: z.enum(["Patient", "Doctor"]),
  phoneNumber: z.string().min(8, "Invalid phone number"),
  CIN: z.string().min(6, "Invalid CIN"),
  specialization: z.string().optional(),
  diplomaImage: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      "Diploma image must be less than 5MB"
    ),
  medicalHistory: z.string().optional(),
  profileImage: z
    .custom<FileList>()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      "Profile image must be less than 5MB"
    ),
  departmentId: z.string().optional(),
})

export const settingsFormSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
})

export const patientProfileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  emergencyName: z.string().min(2, "Emergency contact name must be at least 2 characters"),
  emergencyRelation: z.string().min(2, "Relationship must be at least 2 characters"),
  emergencyPhone: z.string().min(10, "Invalid phone number"),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
}) 