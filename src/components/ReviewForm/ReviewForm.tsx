"use client";

import { useState } from "react";
import { createReview } from "@/lib/api/reviews";
import type { ReviewEntityType, ReviewI } from "@/interfaces";
import { Loader2, Star } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


type Props = {
    entityId: string;
    entityType: ReviewEntityType;
    onAddReview: (review: ReviewI) => void;
};

export default function ReviewForm({ entityId, entityType, onAddReview }: Props) {

    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async () => {

        // if (!isAuthenticated) {
        //     toast.error("You must be logged in to add a review");
        //     setTimeout(() => {
        //         router.push("/login");
        //     }, 1500);
        //     return;
        // }

        setError(null);

        // Validation
        if (rating < 1 || rating > 5) {
            setError("The rating must be from 1 to 5.");
            return;
        }
        if (!comment.trim()) {
            setError("Write a comment");
            return;
        }

        try {
            setLoading(true);
            const newReview = await createReview({ entityId, entityType, rating, comment });
            onAddReview(newReview);
            setRating(0);
            setComment("");
            toast.success("Review Added Successfully");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error");
        } finally {
            setLoading(false);
        }

    };

    return <>
        {isAuthenticated ? (
            <div className="container mx-auto mt-12 w-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6">
                <h3 className="text-2xl text-center font-semibold text-white mb-3">Make Review</h3>

                {/* Rating & Comment */}
                <div className="mb-6">
                    <p className="text-white/80 mb-2">Your Rating</p>

                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} type="button" onClick={() => setRating(star)} className="cursor-pointer transition-transform hover:scale-110">
                                <Star size={26} className={`${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-white/40"}`} />
                            </button>
                        ))}
                    </div>

                    <div className="mt-4">
                        <label className="text-white/80">Your Comment</label>

                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your experience..." className="w-full mt-2.5 p-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4C27A] resize-none" />
                    </div>
                </div>

                {/* Error */}
                {error && (<p className="text-red-800 mb-4">{error}</p>)}

                {/* Submit Button */}
                <Button onClick={submit} disabled={loading} className="w-full p-6 cursor-pointer rounded-2xl bg-[#F4C27A] text-black font-semibold hover:opacity-90 transition-all duration-300 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : "Submit Review"}
                </Button>
            </div>
        ) : (
            <div className="mt-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6 text-center text-white">
                <p className="mb-4">You must be logged in to write a review.</p>
                <Button className="cursor-pointer" onClick={() => router.push("/login")}>
                    Login Now
                </Button>
            </div>
        )}
    </>
}
