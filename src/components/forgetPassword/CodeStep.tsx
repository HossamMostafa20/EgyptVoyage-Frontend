import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from "react"
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type Props = {
    next: () => void
}

export default function CodeStep({ next }: Props) {

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem("resetToken")

        if (savedToken) {
            setCode(savedToken)
        }
    }, []);

    async function handleVerify() {

        setLoading(true)

        const savedToken = localStorage.getItem("resetToken")

        if (!savedToken) {
            toast.error("Verification token not found")
            setLoading(false)
            return
        }

        if (code !== savedToken) {
            toast.error("Invalid verification code")
            setLoading(false)
            return
        }

        setTimeout(() => {
            setLoading(false)
            next()
        }, 800)
    }

    return <>
        <div className="space-y-2">

            <div className='mt-12 space-y-2'>
                <Label className="text-lg ms-1">Verification Code</Label>

                <Input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter verification code" className="w-full h-11 rounded-full bg-[#e6cda6] border-0 shadow-[0_6px_12px_rgba(0,0,0,0.35)] px-4" />
            </div>

            <Button onClick={handleVerify} disabled={loading} className="mt-20 w-full h-12 rounded-2xl text-xl font-semibold bg-linear-to-b from-[#184e77] to-[#021d33] text-white cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? (<Loader2 className="animate-spin" size={20} />) : ("Verify Code")}
            </Button>

        </div>
    </>
}
