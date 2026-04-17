import * as z from "zod";
export const signUPSchema = {
    body: z.object({
        userName: z.string(),
        email: z.string().email(),
        password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/),
        cPassword: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/),
        age: z.number().min(18).max(60),
        address: z.string(),
        phone: z.string()
    }).required().refine((data) => {
        return data.password == data.cPassword;
    }, {
        error: "Password and Confirm Password must match",
        path: ["cPassword"]
    })
};
export const signInSchema = {
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/)
    })
};
export const confirmEmailSchema = {
    body: z.object({
        email: z.string().email(),
        code: z.string().min(6).max(6).regex(/^\d{6}$/)
    })
};
export const resendOtpSchema = {
    body: z.object({
        email: z.string().email(),
    })
};
export const forgetPasswordSchema = {
    body: z.object({
        email: z.string().email(),
    })
};
export const resetPasswordSchema = {
    body: z.object({
        email: z.string().email(),
        code: z.string().regex(/^\d{6}$/),
        nPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/)
    })
};
export const updatePasswordSchema = {
    body: z.object({
        password: z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/),
        nPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*[^A-Za-z0-9]).{8,}$/)
    })
};
