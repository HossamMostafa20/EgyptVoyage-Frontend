"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/Protected/ProtectedRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import React from "react";


type TokenPayload = {
    name: string;
    email: string;
};

export default function Profile() {

    //               علشان اسم اليوزر يظهر
    const [user, setUser] = useState<TokenPayload | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = jwtDecode<TokenPayload>(token);
            setUser(decoded);
        }
    }, []);


    //            علشان شكل Button كل page
    const pathname = usePathname();
    const baseBtn = `px-5 sm:px-6 py-2.5 sm:py-3 mb-2 sm:mb-0 rounded-xl sm:rounded-t-2xl sm:rounded-b-none font-semibold text-sm sm:text-base cursor-pointer`;
    const activeBtn = "bg-[#E1864F] text-white";
    const normalBtn = "bg-[#0D3B66] text-white";

    return <>
        <ProtectedRoute>
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-medium text-[#0D3B66] p-6 sm:p-9">
                Hi , {user?.name}
            </h1>

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
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#0D3B66] mt-6">Personal Info</h2>

                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14 p-6 sm:p-10 py-12 sm:py-20">
                        {/* Avatar */}
                        {/* <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-[#8D7A63] rounded-2xl flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl">🖼️</span>
                    </div> */}

                        {/* Info */}
                        <div className="text-base sm:text-lg md:text-xl text-[#6B5C4B] space-y-3 text-center md:text-left">
                            <p>
                                <span className="text-[#0D3B66] font-bold">Name</span>
                                <span className="text-[#0D3B66] font-bold mx-2">:</span>
                                {user?.name}
                            </p>

                            <p>
                                <span className="text-[#0D3B66] font-bold">Email</span>
                                <span className="text-[#0D3B66] font-bold mx-2">:</span>
                                {user?.email}
                            </p>

                            {/* <p>
                            <span className="text-[#0D3B66] font-bold">Phone</span>
                            <span className="text-[#0D3B66] font-bold mx-2">:</span>
                            01205040###
                        </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    </>
}
