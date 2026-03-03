"use client";

import ReviewForm from '@/components/ReviewForm/ReviewForm';
import ReviewsList from '@/components/ReviewsList/ReviewsList';
import Slider from '@/components/Slider/Slider';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoriteContext';
import { LandmarkI, ReviewI } from '@/interfaces';
import { deleteReview, getReviews } from '@/lib/api/reviews';
import { HeartIcon, MapPin, Star, StarIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function LandmarkDetailsClient({ landmark }: { landmark: LandmarkI }) {

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
                (r) => r.entityId === landmark.id && r.entityType === "Landmark"
            );
            setReviews(filtered);
        };
        fetchReviews();
    }, [landmark.id]);


    //             FAVLIST
    const { toggleFavorite, isFavorite, loading } = useFavorites();
    const isFav = isFavorite(landmark.id, "landmark");

    //    STARS
    const totalStars = 5;
    const safeRating = Math.min(
        Math.max(landmark.rating ?? 0, 0),
        totalStars
    );

    return <>
        <div className="container mx-auto px-6">
            {/* IMAGE */}
            <div className="pt-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <Slider images={landmark.images} />
                </div>
            </div>

            {/* CONTENT */}
            <div className="mt-8">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT SIDE */}
                    <div className="space-y-3">
                        {/* <h1 className="text-3xl lg:text-4xl font-bold text-[#0D3B66]">{landmark.landmarkName}</h1> */}

                        <div className="flex items-center gap-6 text-[#0D3B66]">
                            <h1 className="text-3xl lg:text-4xl font-bold text-[#0D3B66]">{landmark.landmarkName}</h1>
                            <Link href={landmark.location.address}>
                                <MapPin className="cursor-pointer mt-2 hover:scale-110 transition" />
                            </Link>
                        </div>
                    </div>

                    {/* BUTTON */}
                    <Button onClick={() => toggleFavorite(landmark.id, "landmark")} disabled={loading} className="px-8 py-6 rounded-full shadow-lg bg-[#daab65] text-white hover:bg-[#c3985c] transition cursor-pointer flex items-center gap-2">
                        <HeartIcon className={`size-5 transition-all duration-300 ${isFav ? "fill-white scale-110" : ""} `} />
                        {isFav ? "Remove From Favourite" : "Add To Favourite"}
                    </Button>
                </div>

                {/* INFO GRID */}
                <div className=" mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl">
                    {/* City */}
                    <div className="space-y-1">
                        <p className="text-white/75 text-sm tracking-wide">City</p>
                        <p className="font-semibold text-white text-lg sm:text-xl">{landmark.location.city}</p>
                    </div>

                    {/* Opening Hour */}
                    <div className="space-y-1">
                        <p className="text-white/75 text-sm tracking-wide">Opening Hour</p>
                        <p className="font-semibold text-white text-lg sm:text-xl">{landmark.openingHour}</p>
                    </div>

                    {/* Closing Hour */}
                    <div className="space-y-1">
                        <p className="text-white/75 text-sm tracking-wide">Closing Hour</p>
                        <p className="font-semibold text-white text-lg sm:text-xl">{landmark.closingHour}</p>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                        <p className="text-white/75 text-sm tracking-wide">Price</p>
                        <p className="font-semibold text-white text-lg sm:text-xl">{landmark.price}</p>
                    </div>

                    {/* Rating */}
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                        <p className="text-white/75 text-sm tracking-wide">Rating</p>
                        <div className="flex justify-center gap-1.5">
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
                    <p className="text-white/85 leading-relaxed">{landmark.description}</p>
                </div>

                {/* MAKE REVIEW */}
                <ReviewForm entityId={landmark.id} entityType="Landmark"
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
