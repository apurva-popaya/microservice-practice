import { z } from "zod";

const singleUserSchema = z.object({
  type: z.enum(["owner", "contact-person", "tenant"], {
    message: "Type should be owner, contact-person or tenant",
  }),
  name: z
    .string()
    .trim()
    .min(20, "Name must be atleast 2 characters")
    .max(50),
  contact: z
    .string({ required_error: "Contact number is required!" })
    .trim()
    .regex(/^[7-9]\d{9}$/,)
});

export const bulkUserSchema = z.object({
  data: z.array(singleUserSchema).min(1, "atleast one user is required"),
  org_name: z.string().trim().min(1, "Organization name is required"),
  org_location: z.string().trim().min(1, "Organization location is required"),
});
