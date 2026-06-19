import * as z from "zod";
import { PAGE_LIMITS } from "@/lib/constants/general";
import { parsePhoneNumber } from "awesome-phonenumber";

const minLimit = PAGE_LIMITS.XS;
const maxLimit = PAGE_LIMITS.XL;
export const GetCustomersPayloadSchema = z
  .object({
    page: z.coerce
      .number("Page must be a number")
      .int("Page must be an integer")
      .positive("Page must be a positive number")
      .default(1),
    limit: z.coerce
      .number("Limit must be a number")
      .int("Limit must be an integer")
      .min(minLimit, `Limit cannot be less than  ${minLimit}`)
      .max(maxLimit, `Limit cannot exceed 5 ${maxLimit}`)
      .default(minLimit),
    searchQuery: z
      .string("Please provide search query")
      .trim()
      .toLowerCase()
      .optional(),
  })
  .strict();

export const AddEditCustomerSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(256, "Name cannot exceed 256 characters"),
  email: z
    .email("Invalid email format")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  address: z
    .string("Address is required")
    .min(3, "Address cannot be less than 3 characters")
    .max(256, "Name cannot exceed 256 characters"),
  phoneNo: z.string().refine(
    (val) => {
      const pn = parsePhoneNumber(val);
      return pn.valid;
    },
    {
      message: "Invalid international phone number structure.",
    },
  ),
});

export const AddCustomerPayloadSchema = z
  .object({
    name: z
      .string("Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    email: z
      .email("Invalid email format")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
    address: z
      .string("Address is required")
      .min(3, "Address cannot be less than 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    phoneNo: z.string().refine(
      (val) => {
        const pn = parsePhoneNumber(val);
        return pn.valid;
      },
      {
        message: "Invalid international phone number structure.",
      },
    ),
  })
  .strict();

export const EditCustomerPayloadSchema = z
  .object({
    customerId: z.string("Id is required").trim(),
    name: z
      .string("Name is required")
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    email: z
      .email("Invalid email format")
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? undefined : val)),
    address: z
      .string("Address is required")
      .min(3, "Address cannot be less than 3 characters")
      .max(256, "Name cannot exceed 256 characters"),
    phoneNo: z.string().refine(
      (val) => {
        const pn = parsePhoneNumber(val);
        return pn.valid;
      },
      {
        message: "Invalid international phone number structure.",
      },
    ),
  })
  .strict();

export const GetCustomerByIdPayloadSchema = z
  .object({
    customerId: z.string("Customer Id is required").trim(),
  })
  .strict();

export const GetCustomersPropertiesPayloadSchema = z
  .object({
    page: z.coerce
      .number("Page must be a number")
      .int("Page must be an integer")
      .positive("Page must be a positive number")
      .default(1),
    limit: z.coerce
      .number("Limit must be a number")
      .int("Limit must be an integer")
      .min(minLimit, `Limit cannot be less than  ${minLimit}`)
      .max(maxLimit, `Limit cannot exceed 5 ${maxLimit}`)
      .default(minLimit),
    searchQuery: z
      .string("Please provide search query")
      .trim()
      .toLowerCase()
      .optional(),
    id: z.string("Customer Id is required"),
  })
  .strict();
