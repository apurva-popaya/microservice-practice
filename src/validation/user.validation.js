// import { z } from "zod";

// export const userSchema = z.object({
//     type: z.enum(
//         ["owner", "contact-person", "tenant"],
//         {
//             errorMap: () =>({
//                 message: "Type should be owner, contact-person or tenant",
//             }),
//         }
//     ),

//     name: z
//     .string({
//         required_error: "Name is required",
//     })
//     .trim()
//     .min(1, "Name is required")
//     .min(3, "Name should contain at least 3 characters")
//     .max(50, "Name cannot exceed 50 characters")
//     .regex(/^[A-Za-z ]+$/,{
//         message: "Name should contain only alphabets",
//     }),

//     contact: z.
//     number({
//         required_error: "Contact Number is required",
//     })
//     .regex(/^[0-9]{10}$/,
//         {
//             message: "Contact number should be 10 digits only",
//         }
//     ),
// });

import { z } from "zod";

export const userSchema = z.object({
    type: z.enum(["owner", "contact-person", "tenant"], {message: "Type should be owner, contact-person or tenant"}),
    name: z.string({required_error:"Name is required!"}).trim().min(1, "Name is required!").min(2, "Name must be atleast 2 characters").max(50),
    contact: z
    .string({ required_error: "Contact number is required!" })
    .trim()
    .regex(/^[7-9]\d{9}$/,{message: "Invalid number"})
});

export const contactSchema = z.object({
    contact: z
    .string({ required_error: "Contact number is required!" })
    .trim()
    .regex(/^[7-9]\d{9}$/,{message: "Invalid number"})
})