"use client";
// ============================================================
//  TrendingSection.tsx
//  Shows the most popular entities across ALL users
//  in the last 7 days — based on favorites + reviews.
//
//  How it works:
//  1. Calls GET /api/recommendations/trending → gets ranked entity IDs + scores
//  2. Matches IDs against the full items list passed as prop
//  3. Renders them in order with 🔥 badge
// ============================================================
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Loader2, MapPin, TrendingUp } from "lucide-react";

export interface TrendingItem {
    id: string;
    name: string;
    city?: string;
    country?: string;
    imageCover: string;
    href: string;
    badge?: string; // "Hotel" | "Landmark" | "Restaurant" | "Program"
}

interface TrendingScore {
    entity_id: string;
    score: number;
    unique_users: number;
    total_interactions: number;
}

interface Props {
    /** All items from all entity types combined */
    allItems: TrendingItem[];
    limit?: number;
}

const BASE_URL = "http://egyptvoyage.runasp.net/api";

export default function TrendingSection({ allItems, limit = 8 }: Props) {
    const [trending, setTrending] = useState<TrendingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<Map<string, TrendingScore>>(new Map());

    useEffect(() => {
        if (!allItems.length) { setLoading(false); return; }

        fetch(`${BASE_URL}/Recommendations/trending?limit=${limit}&days=7`, {
            cache: "no-store",
        })
            .then((res) => {
                if (!res.ok) throw new Error("trending unavailable");
                return res.json();
            })
            .then((data: { trending: TrendingScore[] }) => {
                if (!data.trending?.length) { setLoading(false); return; }

                // Build a lookup map: entityId → score info
                const scoreMap = new Map(data.trending.map((t) => [t.entity_id, t]));
                setScores(scoreMap);

                // Match trending IDs to actual items
                const ranked: TrendingItem[] = [];
                for (const t of data.trending) {
                    const item = allItems.find((i) => i.id === t.entity_id);
                    if (item) ranked.push(item);
                }

                setTrending(ranked.slice(0, limit));
            })
            .catch(() => {
                // Trending endpoint offline → hide section silently
                setTrending([]);
            })
            .finally(() => setLoading(false));
    }, [allItems, limit]);

    // Don't render anything while loading or if no trending data
    if (loading) {
        return (
            <section className="py-10 px-4 container mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    <h2 className="text-2xl font-bold text-[#0D3B66]">Trending Now</h2>
                </div>
            </section>
        );
    }

    if (!trending.length) return null;

    return (
        <section className="py-10 px-4">
            {/* ── Header ── */}
            <div className="container mx-auto mb-6 flex items-center gap-3 flex-wrap">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
                    <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D3B66]">Trending Now</h2>
                {/* <span className="text-[10px] font-bold tracking-widest uppercase bg-orange-500 text-white px-2.5 py-1 rounded-full">
                    Hot this week
                </span> */}
                {/* <span className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Based on all users' activity
                </span> */}
            </div>

            {/* ── Grid ── */}
            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {trending.map((item, index) => {
                    const scoreInfo = scores.get(item.id);
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-4/3 overflow-hidden">
                                <Image
                                    src={item.imageCover}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Dark overlay on hover */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Rank badge — #1 #2 #3 get special colors */}
                                <span className={`absolute top-2 left-2 text-[11px] font-black px-2 py-0.5 rounded-full
                                    ${index === 0 ? "bg-yellow-400 text-black" :
                                        index === 1 ? "bg-gray-300 text-black" :
                                            index === 2 ? "bg-orange-400 text-white" :
                                                "bg-orange-500 text-white"}`}>
                                    #{index + 1}
                                </span>

                                {/* Entity type badge */}
                                {item.badge && (
                                    <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Unique users count */}
                                {scoreInfo && (
                                    <span className="absolute top-2 right-2 text-[9px] font-semibold bg-white/90 text-gray-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        🔥 {scoreInfo.unique_users} users
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="px-3 py-2.5 bg-[#F5E6C8]">
                                <p className="font-semibold text-[#0D3B66] truncate text-sm">{item.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {(item.city || item.country) && (
                                        <>
                                            <MapPin className="w-3 h-3 text-gray-700 shrink-0" />
                                            <p className="text-xs text-gray-700 truncate mt-0.5">{item.city || item.country}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
