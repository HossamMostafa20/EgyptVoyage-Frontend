type Props = {
    step: number
}

export default function StepIndicator({ step }: Props) {

    const progressWidth = () => {
        if (step === 1) return "0%"
        if (step === 2) return "50%"
        if (step === 3) return "100%"
    }

    return <>
        <div className="relative flex justify-between items-center w-64 mx-auto mb-6">

            {/* Gray line */}
            <div className="absolute top-1/2 left-0 w-full h-0.75 bg-gray-300 -translate-y-1/2 rounded" />

            {/* Blue progress */}
            <div className="absolute top-1/2 left-0 h-0.75 bg-[#184e77] -translate-y-1/2 rounded transition-all duration-300" style={{ width: progressWidth() }} />

            {[1, 2, 3].map((s) => (
                <div key={s} className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm text-white ${step >= s ? "bg-[#184e77]" : "bg-gray-400"}`}>
                    {s}
                </div>
            ))}

        </div>
    </>
}
