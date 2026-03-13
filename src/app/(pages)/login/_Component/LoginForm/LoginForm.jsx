"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendLoginData } from '@/services/authServices'
import { schema } from '@/schema/loginSchema'
import React, { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { setToken } from "@/lib/authToken"
import { useAuth } from '@/context/AuthContext'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const nextUrl = searchParams.get("next") || "/"

    const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
        defaultValues: { email: '', password: '' },
        resolver: zodResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onBlur'
    })

    const { login } = useAuth();
    async function Login(userData) {
        try {
            setLoading(true)
            setApiError(null)

            const response = await sendLoginData(userData)

            const token =
                response?.token ||
                response?.accessToken ||
                response?.data?.token ||
                response?.data?.accessToken

            if (token) {
                login(token)          // ✅ استدعاء عادي
                router.replace(nextUrl)
                return
            }

            setApiError(response?.message || "Login failed (no token returned)")

        } catch (error) {
            setApiError(error?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return <>
        <div className='p-0 sm:p-5'>
            <form onSubmit={handleSubmit(Login)} className="p-5 sm:p-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.45)] bg-linear-to-b from-[#e7cfa6] to-[#d29b52] border-0">

                <h1 className='text-4xl text-center text-[#0D3B66] font-bold mb-6'>
                    Welcome Back !
                </h1>

                {/* Email */}
                <div className="space-y-1 mb-5">
                    <Label className="text-lg ms-1">Email</Label>
                    <Input type="email" placeholder="Enter your email" {...register('email')} className="w-80 h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)]" />
                    {errors.email && touchedFields.email && (
                        <p className="text-red-500 text-sm mt-1 ms-9">
                            {errors.email?.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1 mb-4">
                    <Label className="text-lg ms-1">Password</Label>

                    <div className="relative w-80">
                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...register("password")} className="h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)] pr-10" />

                        <Button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-transparent text-[#0D3B66]">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </Button>
                    </div>

                    {errors.password && touchedFields.password && (
                        <p className="text-red-500 text-sm mt-1 ms-9">
                            {errors.password?.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end mb-4 text-sm">
                    <Link href={'./forget-password'} className="text-[#123a63] hover:underline">
                        forget password?
                    </Link>
                </div>

                <Button disabled={loading} type="submit" className="w-full h-12 rounded-2xl text-2xl font-semibold bg-linear-to-b from-[#184e77] to-[#021d33] cursor-pointer">
                    {loading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>

                {apiError && (
                    <span className='block text-center text-red-500 mt-3.5'>
                        {apiError}
                    </span>
                )}

                <p className="text-center mt-5">
                    Don’t have an account?{" "}
                    <Link href={'/signup'} className="text-[#123a63] font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    </>
}
