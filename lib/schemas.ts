import * as z from "zod";
import { Category, Status } from "./generated/prisma/enums";

const addPinSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must be at most 30 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters"),
  latitude: z.number(),
  longitude: z.number(),
  isActive: z.enum(Status),
  category: z.enum(Category),
  images: z
    .array(z.string())
    .max(10, "You can upload up to 10 images")
    .min(1, "Please upload at least one image"),
  thumbnail: z.string().min(1, "Please select a thumbnail image"),
});

export { addPinSchema };