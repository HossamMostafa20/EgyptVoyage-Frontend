"use client"

import StepIndicator from "./StepIndicator"
import EmailStep from "./EmailStep"
import CodeStep from "./CodeStep"
import ResetStep from "./ResetStep"

type Props = {
    step: number
    setStep: (n: number) => void
}

export default function ForgetPasswordCard({ step, setStep }: Props) {
    return <>
        <div className='p-0 sm:p-5'>

            <div className="p-5 sm:p-8 w-95 min-h-105 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.45)] bg-linear-to-b from-[#e7cfa6] to-[#d29b52] border-0">

                <h1 className='text-4xl text-center text-[#0D3B66] font-bold mb-6'>Forget Password</h1>

                <StepIndicator step={step} />

                {step === 1 && <EmailStep next={() => setStep(2)} />}
                {step === 2 && <CodeStep next={() => setStep(3)} />}
                {step === 3 && <ResetStep />}

            </div>
        </div>
    </>
}
