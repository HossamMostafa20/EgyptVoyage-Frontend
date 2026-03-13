import { z } from "zod";

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(6, "Current password must be at least 6 characters"),

        // newPassword: z.string().min(6, "New password must be at least 6 characters"),

        newPassword: z
            .string()
            .nonempty("Password is required")
            .min(6, "Password must be at least 6 characters")
            .regex(/[A-Z]/, "Must contain uppercase letter")
            .regex(/[a-z]/, "Must contain lowercase letter")
            .regex(/[0-9]/, "Must contain number")
            .regex(/[#?!@$%^&*-]/, "Must contain special character"),

        // confirmNewPassword: z.string().min(6, "Confirm password must be at least 6 characters"),

        confirmNewPassword: z.string().nonempty('confirmNewPassword is required'),
    }).refine((data) => data.newPassword === data.confirmNewPassword, { message: "newPassword and confirmNewPassword dont match", path: ["confirmNewPassword"], });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
