"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartIcon, StarIcon } from "lucide-react";
import { EntityType } from "@/interfaces";
import { useFavorites } from "@/context/FavoriteContext";
import Link from "next/link";

interface Props {
    id: string;
    entityType: EntityType;
    title: string;
    city?: string;
    description?: string;
    image: string;
    rating?: number;
    showFavoriteButton?: boolean;
}


export default function FavoriteCard({ id, entityType, title, city, description, image, rating, showFavoriteButton = true }: Props) {

    const { toggleFavorite, isFavorite, loading } = useFavorites();
    const isFav = isFavorite(id, entityType);

    const getDetailsPath = () => {
        switch (entityType) {
            case "hotel":
                return `/hotel/${id}`;
            case "landmark":
                return `/landmark/${id}`;
            case "restaurant":
                return `/restaurant/${id}`;
            case "program":
                return `/program/${id}`;
        }
    };

    return <>
        <div className="p-0.5">
            <Link href={getDetailsPath()}>
                <Card className="flex flex-col h-full transform transition-all duration-500 hover:shadow-[0_0_13px_rgba(0,0,0,0.15)] hover:shadow-black">

                    <Image src={image} className="w-full h-48 rounded-t-xl object-cover" alt={title} width={500} height={500} />

                    <CardHeader className="grow">
                        <CardTitle className="mt-2.5">{title}</CardTitle>
                        {city && <CardAction className="justify-self-start mt-2">{city}</CardAction>}

                        {/* {rating !== undefined && (
                        <div className="flex mt-1.5 items-center">
                            {Array.from({ length: rating }).map((_, i) => (
                                <StarIcon key={i} className='w-5 h-5 fill-yellow-300 text-yellow-300' />
                            ))}
                            <div className="ms-1.5 text-lg text-yellow-300">({rating})</div>
                        </div>
                    )} */}

                        {/* {description && (
                        <CardDescription className="mt-2.5 mb-1.5 line-clamp-2">{description}</CardDescription>
                    )} */}
                    </CardHeader>

                    {showFavoriteButton &&
                        <Button className="cursor-pointer mt-2.5 mx-7 mb-5 bg-linear-to-b from-[#D3A15C] to-[#00000055] text-white transition-all duration-300" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id, entityType); }} disabled={loading}>
                            <HeartIcon className={`size-5 me-2 transition-all duration-300 ${isFav && "fill-white scale-110"}`} />
                            {isFav && "Remove From Favourite"}
                        </Button>}
                </Card>
            </Link>
        </div>
    </>
}
