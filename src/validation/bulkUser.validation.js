import { z } from "zod";
import { normalizePhoneNumber ,validatePhoneNumber } from "../utils/phone.js";

const singleUserSchema = z
  .object({
    type: z.enum(["owner", "contact-person", "tenant"], {
      error: (issue) =>
        issue.input === undefined
          ? "Type is required"
          : "Type should be owner, contact-person or tenant",
    }),
    // type: z.enum(["owner", "contact-person", "tenant"], {
    //   error: "Type is required",
    // }),

    name: z
      .string({error: "Name is required",})
      .trim()
      .min(2, "Name must be atleast 2 characters")
      .max(50),

    contact: z
      .string({error: "Contact is required",})
      .trim(),
  })

  .superRefine((data, ctx) => {
    const normalizeContact = normalizePhoneNumber(data.contact);
    const errors = validatePhoneNumber(normalizeContact);

    errors.forEach((error) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [error.field],
        message: error.message,
      });
    });
  });

export const bulkUserSchema = z.object({
  data: z.array(singleUserSchema).min(1, "atleast one user is required"),

  org_name: z
    .string({error: "Organization name is required",})
    .trim()
    .min(1, "Organization name is required"),
    
  org_location: z
    .string({error: "Organization Location is required",})
    .trim()
    .min(1, "Organization location is required"),
});
