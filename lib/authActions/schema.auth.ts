import * as z from "zod";

export const RegisterUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name cannot be longer than 30 characters"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/\d/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must include at least one special character.",
      ),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const RegisterUserPayloadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name cannot be longer than 30 characters")
      .toLowerCase(),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/\d/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must include at least one special character.",
      ),

    token: z.string(),
  })
  .strict();

export const LoginUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long.")
    .max(64, "Password cannot be longer than 64 characters"),
});
export const LoginUserPayloadSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters"),
  })
  .strict();

export const UpdateUserNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot be longer than 30 characters"),
});

export const UpdateUserNamePayloadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name cannot be longer than 30 characters")
      .toLowerCase(),
  })
  .strict();

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters"),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/\d/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must include at least one special character.",
      ),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdatePasswordPayloadSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters"),
    newPassword: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/\d/, "Password must include at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "Password must include at least one special character.",
      ),
  })
  .strict();
