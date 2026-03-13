import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPassword } from '@/services/authForget.service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'

const resetSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmNewPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    })

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetStep() {

    const [firstshowPassword, setFirstShowPassword] = useState(false);
    const [secondshowPassword, setSecondShowPassword] = useState(false);

    const router = useRouter();

    const { register, handleSubmit, formState: { errors, touchedFields, isSubmitting } } = useForm<ResetFormValues>({
        resolver: zodResolver(resetSchema),
        mode: "onTouched"
    });


    async function onSubmit(data: ResetFormValues) {

        const token = localStorage.getItem("resetToken")

        if (!token) {
            toast.error("Token not found")
            return
        }

        try {
            await resetPassword(token, data.newPassword, data.confirmNewPassword);

            toast.success("Password reset successfully");

            localStorage.removeItem("resetToken");
            localStorage.removeItem("resetEmail");

            setTimeout(() => {
                router.push("/login");
            }, 800);

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong")
            }
        }
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className='relative space-y-1.5'>
                <Label className="text-lg ms-1">New Password</Label>
                <Input type={firstshowPassword ? "text" : "password"} placeholder="Enter new password" {...register("newPassword")} className="w-full h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)] px-4 pr-12" />
                <Button type="button" onClick={() => setFirstShowPassword(!firstshowPassword)} className="absolute right-1.5 top-1/4 translate-y-1/2 bg-transparent text-[#0D3B66]">
                    {firstshowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
                {errors.newPassword && touchedFields.newPassword && (
                    <p className="text-red-500 text-sm ms-1">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>

            <div className='relative space-y-1.5'>
                <Label className="text-lg ms-1">Confirm Password</Label>
                <Input type={secondshowPassword ? "text" : "password"} placeholder="Confirm password" {...register("confirmNewPassword")} className="w-full h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)] px-4" />
                <Button type="button" onClick={() => setSecondShowPassword(!secondshowPassword)} className="absolute right-1.5 top-1/4 translate-y-1/2 bg-transparent text-[#0D3B66]">
                    {secondshowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
                {errors.confirmNewPassword && touchedFields.confirmNewPassword && (
                    <p className="text-red-500 text-sm ms-1">
                        {errors.confirmNewPassword.message}
                    </p>
                )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-2xl text-xl font-semibold bg-linear-to-b from-[#184e77] to-[#021d33] text-white mt-5 cursor-pointer flex items-center justify-center gap-2">
                {isSubmitting ? (<Loader2 className="animate-spin" size={20} />) : ("Reset Password")}
            </Button>
        </form>
    </>
}
