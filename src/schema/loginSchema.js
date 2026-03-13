import * as zod from 'zod'

export const schema = zod.object({
    email: zod.string().nonempty('Email Is Requried')
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email Is InValid'),

    // password: zod.string().nonempty('Password Is Required')
    //     .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password Is InValid'),

    password: zod
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Must contain uppercase letter")
        .regex(/[a-z]/, "Must contain lowercase letter")
        .regex(/[0-9]/, "Must contain number")
        .regex(/[#?!@$%^&*-]/, "Must contain special character"),
});
