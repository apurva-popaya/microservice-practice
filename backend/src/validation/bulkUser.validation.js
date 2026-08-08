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

  listingId: z
    .string({error: "Listing ID name is required",})
    .trim()
    .min(1, "Listing ID name is required"),
    
  brokerId: z
    .string({error: "Broker ID Location is required",})
    .trim()
    .min(1, "Broker ID location is required"),

  firmId: z
    .string({error: "Firm ID Location is required",})
    .trim()
    .min(1, "Firm ID location is required"),
});


export const updateUserSchema = z
  .object({
    type: z.enum(["owner", "contact-person", "tenant"], {
      error: (issue) =>
        issue.input === undefined
          ? "Type is required"
          : "Type should be owner, contact-person or tenant",
    }).optional(),
    // type: z.enum(["owner", "contact-person", "tenant"], {
    //   error: "Type is required",
    // }),

    name: z
      .string({error: "Name is required",})
      .trim()
      .min(2, "Name must be atleast 2 characters")
      .max(50).optional(),

    contact: z
      .string({error: "Contact is required",})
      .trim().optional(),
  })

  .superRefine((data, ctx) => {

  if (data.contact === undefined) {
    return;
  }

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
