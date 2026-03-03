"use client";

import Slider from '@/components/Slider/Slider';
import { Button } from '@/components/ui/button'
import { HotelI } from '@/interfaces';
import { Globe, MapPin, Star, StarIcon, HeartIcon } from 'lucide-react'
import Link from 'next/link';
import { useFavorites } from '@/context/FavoriteContext';
import { useEffect, useState } from "react";
import { deleteReview, getReviews } from "@/lib/api/reviews";
import type { ReviewI } from "@/interfaces";
import ReviewForm from '@/components/ReviewForm/ReviewForm';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import { useAuth } from '@/context/AuthContext';


export default function HotelsDetailsClient({ hotel }: { hotel: HotelI }) {

    const { user } = useAuth();

    //       DELETE REVIEW
    const handleDelete = async (id: string) => {
        await deleteReview(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
    };


    //           MAKE REVIEW
    const [reviews, setReviews] = useState<ReviewI[]>([]);
    useEffect(() => {
        const fetchReviews = async () => {
            const data = await getReviews();
            const filtered = data.filter(
                (r) => r.entityId === hotel.id && r.entityType === "Hotel"
            );
            setReviews(filtered);
        };
        fetchReviews();
    }, [hotel.id]);


    //             FAVLIST
    const { toggleFavorite, isFavorite, loading } = useFavorites();
    const isFav = isFavorite(hotel.id, "hotel");

    //    STARS
    const totalStars = 5;
    const safeRating = Math.min(
        Math.max(hotel.level ?? 0, 0),
        totalStars
    );

    return <>
        <div className="container mx-auto px-6">
            {/* IMAGE */}
            <div className="pt-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <Slider images={hotel.images} />
                </div>
            </div>

            {/* CONTENT */}
            <div className="mt-8">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT SIDE */}
                    <div className="space-y-3">
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#0D3B66]">{hotel.hotelName}</h1>

                        <div className="flex items-center gap-6 text-[#0D3B66]">
                            <Link href={hotel.websiteLink}>
                                <Globe className="cursor-pointer hover:scale-110 transition" />
                            </Link>

                            <Link href={hotel.location.address}>
                                <MapPin className="cursor-pointer hover:scale-110 transition" />
                            </Link>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <Button onClick={() => toggleFavorite(hotel.id, "hotel")} disabled={loading} className="px-8 py-6 rounded-full shadow-lg bg-[#daab65] text-white hover:bg-[#c3985c] transition cursor-pointer flex items-center gap-2">
                        <HeartIcon className={`size-5 transition-all duration-300 ${isFav ? "fill-white scale-110" : ""} `} />
                        {isFav ? "Remove From Favourite" : "Add To Favourite"}
                    </Button>
                </div>

                {/* INFO GRID */}
                <div className="mt-8 max-w-xl text-center flex justify-around gap-6 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl">
                    <div>
                        <p className="text-white/60 text-lg">City</p>
                        <p className="font-semibold text-white text-2xl">{hotel.location.city}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-white/60 text-lg mb-2">Level</p>
                        <div className="flex gap-1.5 text-[#F4C27A]">
                            {Array.from({ length: totalStars }, (_, index) => {
                                const isFilled = index < Math.floor(safeRating)
                                return (<StarIcon key={index} className={`w-5 h-5 sm:w-6 sm:h-6 transition ${isFilled ? "text-yellow-400 fill-yellow-400" : "text-white/30"}`} />)
                            })}
                        </div>
                    </div>
                </div>

                {/* OVERVIEW */}
                <div className="mt-8 backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
                    <p className="text-white/85 leading-relaxed">{hotel.description}</p>
                </div>


                {/* MAKE REVIEW */}
                <ReviewForm entityId={hotel.id} entityType="Hotel"
                    onAddReview={(newReview) => setReviews((prev) => [
                        {
                            ...newReview,
                            touristName: user?.name,
                        },
                        ...prev,
                    ])}
                />
                <ReviewsList reviews={reviews} onDelete={handleDelete} />
            </div>
        </div>
    </>
}
