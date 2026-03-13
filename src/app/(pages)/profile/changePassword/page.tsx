"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/Protected/ProtectedRoute";
import React, { useEffect, useState } from 'react'
import { updatePassword } from '@/services/authForget.service'
import { toast } from 'sonner'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/schema/changePasswordSchema/changePasswordSchema";
import { jwtDecode } from 'jwt-decode'

type TokenPayload = {
    name: string;
    email: string;
};

export default function ChangePassword() {

    //               علشان اسم اليوزر يظهر
    const [user, setUser] = useState<TokenPayload | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = jwtDecode<TokenPayload>(token);
            setUser(decoded);
        }
    }, []);


    const [firstshow, setFirstshow] = useState(false);
    const [secondshow, setSecondshow] = useState(false);
    const [thirdshow, setThirdshow] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            const res = await updatePassword(data.currentPassword, data.newPassword, data.confirmNewPassword);

            toast.success(res.message);

            reset();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const pathname = usePathname();
    const baseBtn = `px-5 sm:px-6 py-2.5 sm:py-3 mb-2 sm:mb-0 rounded-xl sm:rounded-t-2xl sm:rounded-b-none font-semibold text-sm sm:text-base cursor-pointer`;
    const activeBtn = "bg-[#E1864F] text-white";
    const normalBtn = "bg-[#0D3B66] text-white";

    return <>
        <ProtectedRoute>
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-medium text-[#0D3B66] p-6 sm:p-9">Hi , {user?.name}</h1>

            <div className="flex flex-col items-center justify-center px-4">
                {/* Tabs */}
                <div className="flex flex-col sm:flex-row gap-3 z-10 w-80 sm:w-full sm:justify-center">
                    <Link href="/profile" className="w-full sm:w-auto">
                        <button className={`${baseBtn} w-full ${pathname === "/profile" ? activeBtn : normalBtn}`}>Profile Info</button>
                    </Link>

                    {/* <Link href="/profile/editProfile" className="w-full sm:w-auto">
                        <button className={`${baseBtn} w-full ${pathname === "/profile/editProfile" ? activeBtn : normalBtn}`}>Edit Profile</button>
                    </Link> */}

                    <Link href="/profile/changePassword" className="w-full sm:w-auto">
                        <button className={`${baseBtn} w-full ${pathname === "/profile/changePassword" ? activeBtn : normalBtn}`}>Change password</button>
                    </Link>
                </div>

                {/* Card */}
                <div className="w-full max-w-5xl bg-[#E5BB7A] rounded-[30px] shadow-2xl mb-3">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#0D3B66] mt-6">Update Password</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-4'>
                        <div>
                            <Label className="text-lg ms-1.5 p-0.5">Current Password</Label>
                            <div className="relative">
                                <Input {...register("currentPassword")} type={firstshow ? "text" : "password"} placeholder="Enter Your Current Password" className=" rounded-full bg-[#FFE4BC] px-6 py-5 pr-12" />

                                <Button type="button" onClick={() => setFirstshow(!firstshow)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D3B66] bg-transparent">
                                    {firstshow ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-red-500 text-sm ms-1.5 mt-0.5">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label className="text-lg ms-1.5 p-0.5">New Password</Label>
                            <div className="relative">
                                <Input {...register("newPassword")} type={secondshow ? "text" : "password"} placeholder="Enter Your New Password" className=" rounded-full bg-[#FFE4BC] px-6 py-5 pr-12" />

                                <Button type="button" onClick={() => setSecondshow(!secondshow)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D3B66] bg-transparent">
                                    {secondshow ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm ms-1.5 mt-0.5">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label className="text-lg ms-1.5 p-0.5">Confirm Password</Label>
                            <div className="relative">
                                <Input {...register("confirmNewPassword")} type={thirdshow ? "text" : "password"} placeholder="Confirm Your New Password" className=" rounded-full bg-[#FFE4BC] px-6 py-5 pr-12" />

                                <Button type="button" onClick={() => setThirdshow(!thirdshow)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0D3B66] bg-transparent">
                                    {thirdshow ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                            {errors.confirmNewPassword && (
                                <p className="text-red-500 text-sm ms-1.5 mt-0.5">
                                    {errors.confirmNewPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 justify-evenly pt-5">
                            <Button type="submit" disabled={isSubmitting} className="px-12 py-6 rounded-full text-lg font-semibold bg-linear-to-b from-[#135491] to-[#001d35] cursor-pointer flex items-center justify-center min-w-60">
                                {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : "Update Password"}
                            </Button>
                            <Link href={'../forget-password'}>
                                <Button className="px-12 py-6 rounded-full text-lg font-semibold bg-linear-to-b from-[#D3A15C] to-[#00000094] cursor-pointer">
                                    Forget Password
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    </>
}
