"use client"

import { useState } from "react"
import ForgetPasswordCard from "@/components/forgetPassword/ForgetPasswordCard"

export default function Page() {

    const [step, setStep] = useState(1)

    return <>
        <div className="min-h-[90vh] flex flex-col justify-center items-center">

            <ForgetPasswordCard step={step} setStep={setStep} />

        </div>
    </>
}
