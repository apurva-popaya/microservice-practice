import { z } from "zod";

const singleUserSchema = z.object({
    type: z.enum(["owner", "contact-person", "tenant"], {message: "Type should be owner, contact-person or tenant"}),
    name: z.string({required_error:"Name is required!"}).trim().min(1, "Name is required!").min(2, "Name must be atleast 2 characters").max(50),
    contact: z.string({required_error:"Contact number is required!"}).trim().min(1, "Contact number is required!").regex(/^[0-9]{10}$/, {message: "Contact number should be 10 digits only",}).refine((contact) => /^[7-9]/.test(contact), { message: "Invalid Contact number!" }).transform((contact)=> Number(contact)),
});

export const bulkUserSchema = z.object({
    data:z.array(singleUserSchema).min(1, "atleast one user is required"),
    org_name: z.string().trim().min(1, "Organization name is required"),
    org_location: z.string().trim().min(1, "Organization location is required"),
});