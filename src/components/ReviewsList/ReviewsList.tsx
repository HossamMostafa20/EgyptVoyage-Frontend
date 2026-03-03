"use client";

import { Loader2, Star, Trash, Trash2 } from "lucide-react";
import type { ReviewI } from "@/interfaces";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";


interface Props {
    reviews: ReviewI[];
    onDelete: (id: string) => void;
}

export default function ReviewsList({ reviews, onDelete }: Props) {

    const { isAuthenticated } = useAuth();

    const { user } = useAuth();

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDeleteClick = async (id: string) => {
        try {
            setDeletingId(id);
            await onDelete(id);
            toast("Review Deleted Successfully", {
                icon: <Trash2 size={18} />,
                style: {
                    background: "#FDECEC",
                    color: "#7F1D1D",
                    border: "1px solid #FCA5A5",
                },
            });
        } catch (error) {
            toast.error("Failed to delete review");
        } finally {
            setDeletingId(null);
        }
    };

    return <>
        <div className="container mx-auto mt-12 space-y-6 mb-5">
            {reviews.map((review) => (
                <div key={review.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-1.5">

                        {/* Name + Date */}
                        <div className="flex items-center gap-4">
                            <h4 className="font-semibold text-white">{review.touristName}</h4>

                            <p className="text-sm text-white/60">{new Date(review.createdAt).toLocaleDateString("en-GB")}</p>
                        </div>

                        {/* Remove Button */}
                        {review.touristId === user?.sub && (
                            <Button onClick={() => handleDeleteClick(review.id)} disabled={deletingId === review.id} className="cursor-pointer bg-[#F4C27A] hover:opacity-80 p-2 rounded-xl transition disabled:opacity-50">
                                {deletingId === review.id ? (<Loader2 size={18} className="animate-spin text-black" />) : (<Trash2 size={18} className="text-black" />)}
                            </Button>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex text-[#F4C27A] mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                            <Star key={`filled-${i}`} fill="#F4C27A" stroke="none" size={22} />
                        ))}

                        {[...Array(5 - review.rating)].map((_, i) => (
                            <Star key={`empty-${i}`} size={22} />
                        ))}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-white/80">{review.comment}</p>
                </div>
            ))}

            {/* لو مفيش ريفيوهات */}
            {/* {reviews.length === 0 && (<p className="text-white/60">No reviews yet.</p>)} */}
        </div>
    </>
}
