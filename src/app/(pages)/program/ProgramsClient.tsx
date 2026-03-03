"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/context/FavoriteContext";
import { ProgramI } from "@/interfaces";
import { Clock, HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProgramsClient({ programs }: { programs: ProgramI[] }) {

    const { toggleFavorite, isFavorite, loading } = useFavorites();

    return <>
        <h1 className="text-4xl font-semibold text-center p-3.5 text-[#0D3B66]">Discover Our Programs</h1>

        <div className="container mx-auto p-2 lg:p-1.5 xl:p-2 md:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {programs.map((program) => {
                const isFav = isFavorite(program.id, "program");
                return (
                    <div key={program.id} className="p-0.5">
                        <Card className="flex flex-col transform transition-all duration-500 hover:shadow-[0_0_13px_rgba(0,0,0,0.15)] hover:shadow-black">

                            <Link href={"/program/" + program.id}>
                                <div className="relative w-full aspect-4/3">
                                    <Image src={program.imageCover} alt={program.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover rounded-t-xl" />
                                </div>

                                <CardHeader className="flex-1">
                                    <CardTitle className="mt-2.5">
                                        {program.name.split(" ").slice(0, 3).join(" ")}
                                    </CardTitle>

                                    <CardAction className="justify-self-start mt-2">
                                        {program.country}
                                    </CardAction>

                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1 font-bold mt-2 text-yellow-500">
                                            <Clock className="size-4 mt-0.5" />
                                            {program.duration}
                                        </span>
                                        <span className="font-bold mt-2 text-yellow-500">{program.price} $</span>
                                    </div>
                                </CardHeader>
                            </Link>

                            <Button className={`mt-2.5 cursor-pointer mx-7 py-5 mb-5 bg-linear-to-b transition-all duration-300 from-[#D3A15C] to-[#00000055] text-white`} onClick={() => toggleFavorite(program.id, "program")} disabled={loading}>
                                <HeartIcon className={`me-2 size-5 transition-all duration-300 ${isFav ? "fill-white text-white scale-110" : ""}`} />
                                {isFav ? "Remove From Favourite" : "Add To Favourite"}
                            </Button>
                        </Card>
                    </div>
                );
            })}
        </div>
    </>
}
