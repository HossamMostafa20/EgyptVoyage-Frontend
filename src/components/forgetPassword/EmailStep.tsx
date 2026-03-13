"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPassword } from "@/services/authForget.service"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

type Props = {
    next: () => void
}

const emailSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
})

type EmailFormValues = z.infer<typeof emailSchema>

export default function EmailStep({ next }: Props) {

    // const [token, setToken] = useState("");

    const { register, handleSubmit, formState: { errors, touchedFields, isSubmitting }, } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        mode: "onTouched",
    })

    async function onSubmit(data: EmailFormValues) {
        console.log(data.email);

        const response = await forgotPassword(data.email)
        console.log(response.resetToken);

        // toast(
        //     <div className="flex items-center gap-3">
        //         <span className="text-sm">Verification Code:</span>

        //         <code className="bg-black/10 px-2 py-1 rounded">
        //             {response.resetToken}
        //         </code>

        //         <button onClick={() => {
        //             navigator.clipboard.writeText(response.resetToken);
        //             toast.success("Code copied!")
        //         }}
        //             className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
        //         >
        //             Copy
        //         </button>
        //     </div>
        // )

        // setToken(response.resetToken);

        localStorage.setItem("resetToken", response.resetToken)
        localStorage.setItem("resetEmail", data.email)

        next()
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <div className="space-y-2">
                <div className='mt-5 space-y-2'>
                    <Label className="text-lg ms-1">Email</Label>

                    <Input type="email" placeholder="Enter your email" {...register("email")} className="w-full h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)] px-4" />
                </div>

                <div className="min-h-5">
                    {errors.email && touchedFields.email && (
                        <p className="text-red-500 text-sm ms-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-13 w-full h-12 rounded-2xl text-xl font-semibold bg-linear-to-b from-[#184e77] to-[#021d33] text-white cursor-pointer">
                {isSubmitting ? (<Loader2 className="animate-spin" size={20} />) : ("Send Code")}
            </Button>
        </form>
    </>
}
