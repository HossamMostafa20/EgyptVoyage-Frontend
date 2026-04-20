// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { SparklesIcon } from "lucide-react";
// import {
//     getRecommendations,
//     sortByRecommendation,
// } from "@/services/recommendation.service";

// // ──────────────────────────────────────────────
// // Generic shape — hotels, landmarks, restaurants, programs all have these
// // ──────────────────────────────────────────────
// interface RecommendedItem {
//     id: string;
//     name: string;          // filled from entity-specific name field
//     city?: string;
//     imageCover: string;
//     href: string;          // e.g. /hotel/abc123
// }

// interface Props {
//     /** All items (hotels / landmarks / etc.) pre-fetched from the API */
//     items: RecommendedItem[];
//     /** Label shown above the section */
//     title?: string;
//     /** How many cards to show */
//     limit?: number;
// }

// export default function RecommendedSection({
//     items,
//     title = "Recommended For You",
//     limit = 8,
// }: Props) {
//     const [sorted, setSorted] = useState<RecommendedItem[]>(items.slice(0, limit));
//     const [loading, setLoading] = useState(false);
//     const [aiActive, setAiActive] = useState(false);

//     useEffect(() => {
//         if (!items.length) return;

//         const token =
//             typeof window !== "undefined" ? localStorage.getItem("token") : null;

//         if (!token) {
//             // Not logged in → just show first N items
//             setSorted(items.slice(0, limit));
//             return;
//         }

//         setLoading(true);

//         const entityIds = items.map((i) => i.id);

//         getRecommendations(token, entityIds, "view", limit)
//             .then((res) => {
//                 const reordered = sortByRecommendation(items, res.recommendations);
//                 setSorted(reordered.slice(0, limit));
//                 setAiActive(true);
//             })
//             .catch(() => {
//                 // AI offline → fallback to original order
//                 setSorted(items.slice(0, limit));
//             })
//             .finally(() => setLoading(false));
//     }, [items, limit]);

//     if (!sorted.length) return null;

//     return <>
//     <section className="py-10 px-4 container mx-auto">
//             {/* Header */}
//             <div className="flex items-center gap-2 mb-6">
//                 <SparklesIcon className="w-5 h-5 text-[#D3A15C]" />
//                 <h2 className="text-2xl font-bold text-[#0D3B66]">{title}</h2>
//                 {aiActive && (
//                     <span className="ml-2 text-xs bg-[#0D3B66] text-white px-2 py-0.5 rounded-full">
//                         AI Powered
//                     </span>
//                 )}
//                 {loading && (
//                     <span className="ml-2 text-xs text-gray-400 animate-pulse">
//                         Personalizing…
//                     </span>
//                 )}
//             </div>

//             {/* Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {sorted.map((item) => (
//                     <Link
//                         key={item.id}
//                         href={item.href}
//                         className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
//                     >
//                         <div className="relative w-full aspect-[4/3]">
//                             <Image
//                                 src={item.imageCover}
//                                 alt={item.name}
//                                 fill
//                                 sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                                 className="object-cover group-hover:scale-105 transition-transform duration-500"
//                             />
//                         </div>
//                         <div className="bg-white px-3 py-2">
//                             <p className="font-semibold text-[#0D3B66] truncate text-sm">
//                                 {item.name}
//                             </p>
//                             {item.city && (
//                                 <p className="text-xs text-gray-400 truncate">{item.city}</p>
//                             )}
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </section>
//     </>

// }





// "use client";
// // ============================================================
// //  RecommendedSection.tsx
// //  Smart AI recommendations with favorites-based fallback.
// //  - Logged in + AI working + meaningful scores → AI order
// //  - Logged in + AI flat scores → favorites first
// //  - Not logged in → favorites first (from localStorage cache)
// // ============================================================
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Sparkles, Loader2, Heart } from "lucide-react";
// import {
//     getRecommendations,
//     sortByRecommendation,
//     sortByFavoritesFirst,
//     scoresAreMeaningful,
//     RecommendationScore,
// } from "@/services/recommendation.service";

// export interface RecommendedItem {
//     id: string;
//     name: string;
//     city?: string;
//     imageCover: string;
//     href: string;
//     badge?: string;
// }

// type SortMode = "ai" | "favorites" | "default";

// interface Props {
//     items: RecommendedItem[];
//     /** IDs of items the current user has favorited (pass from FavoriteContext) */
//     favoriteIds?: string[];
//     title?: string;
//     limit?: number;
// }

// export default function RecommendedSection({
//     items,
//     favoriteIds = [],
//     title = "Recommended For You",
//     limit = 8,
// }: Props) {
//     const [sorted, setSorted] = useState<RecommendedItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [mode, setMode] = useState<SortMode>("default");

//     useEffect(() => {
//         if (!items.length) { setLoading(false); return; }

//         const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//         // ── NOT LOGGED IN: favorites-first from props ──────────
//         if (!token) {
//             if (favoriteIds.length > 0) {
//                 setSorted(sortByFavoritesFirst(items, favoriteIds).slice(0, limit));
//                 setMode("favorites");
//             } else {
//                 setSorted(items.slice(0, limit));
//                 setMode("default");
//             }
//             setLoading(false);
//             return;
//         }

//         // ── LOGGED IN: try AI first ───────────────────────────
//         setLoading(true);
//         getRecommendations(token, items.map((i) => i.id), "view", limit)
//             .then((res) => {
//                 if (scoresAreMeaningful(res.recommendations)) {
//                     // AI returned meaningful different scores → use AI
//                     setSorted(sortByRecommendation(items, res.recommendations).slice(0, limit));
//                     setMode("ai");
//                 } else {
//                     // AI scores all flat → fall back to favorites-first
//                     setSorted(sortByFavoritesFirst(items, favoriteIds).slice(0, limit));
//                     setMode("favorites");
//                 }
//             })
//             .catch(() => {
//                 // AI offline → favorites-first fallback
//                 setSorted(sortByFavoritesFirst(items, favoriteIds).slice(0, limit));
//                 setMode("favorites");
//             })
//             .finally(() => setLoading(false));
//     }, [items, favoriteIds, limit]);

//     if (!sorted.length && !loading) return null;

//     return (
//         <section className="py-10 px-4">
//             {/* Header */}
//             <div className="container mx-auto mb-6 flex items-center gap-3">
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D3A15C]/20">
//                     {mode === "favorites"
//                         ? <Heart className="w-4 h-4 text-[#D3A15C] fill-[#D3A15C]" />
//                         : <Sparkles className="w-4 h-4 text-[#D3A15C]" />
//                     }
//                 </div>
//                 <h2 className="text-2xl font-bold text-[#0D3B66]">{title}</h2>
//                 {mode === "ai" && (
//                     <span className="text-[10px] font-semibold tracking-widest uppercase bg-[#0D3B66] text-white px-2.5 py-1 rounded-full">
//                         AI Powered
//                     </span>
//                 )}
//                 {mode === "favorites" && favoriteIds.length > 0 && (
//                     <span className="text-[10px] font-semibold tracking-widest uppercase bg-[#D3A15C] text-white px-2.5 py-1 rounded-full">
//                         Based on your favourites
//                     </span>
//                 )}
//                 {loading && <Loader2 className="w-4 h-4 text-[#D3A15C] animate-spin ml-1" />}
//             </div>

//             {/* Cards */}
//             <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
//                 {sorted.map((item, i) => (
//                     <Link
//                         key={item.id}
//                         href={item.href}
//                         className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
//                     >
//                         <div className="relative w-full aspect-4/3 overflow-hidden">
//                             <Image
//                                 src={item.imageCover}
//                                 alt={item.name}
//                                 fill
//                                 sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                                 className="object-cover group-hover:scale-110 transition-transform duration-500"
//                             />
//                             <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             {item.badge && (
//                                 <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[#D3A15C] text-white px-2 py-0.5 rounded-full">
//                                     {item.badge}
//                                 </span>
//                             )}
//                             {/* Heart overlay if favorited */}
//                             {favoriteIds.includes(item.id) && (
//                                 <span className="absolute top-2 right-2">
//                                     <Heart className="w-4 h-4 text-red-400 fill-red-400 drop-shadow" />
//                                 </span>
//                             )}
//                         </div>
//                         <div className="px-3 py-2.5">
//                             <p className="font-semibold text-[#0D3B66] truncate text-sm">{item.name}</p>
//                             {item.city && <p className="text-xs text-gray-400 truncate mt-0.5">{item.city}</p>}
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </section>
//     );
// }








"use client";
// ============================================================
//  RecommendedSection.tsx
//  Smart recommendation UI — ranks items based on user's
//  full interaction history (views + favorites + reviews).
//  Shows WHY items were recommended (city match, interacted).
// ============================================================
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Loader2, Heart, MapPin, Eye } from "lucide-react";
import { smartRank, hasPersonalizationData } from "@/services/smartRecommend";

export interface RecommendedItem {
    id: string;
    name: string;
    city?: string;
    country?: string;
    imageCover: string;
    href: string;
    badge?: string;
    entityType?: "hotel" | "landmark" | "restaurant" | "program";
}

interface Props {
    items: RecommendedItem[];
    favoriteIds?: string[];
    title?: string;
    limit?: number;
}

export default function RecommendedSection({
    items,
    favoriteIds = [],
    title = "Recommended For You",
    limit = 8,
}: Props) {
    const [userId, setUserId] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // Read userId from JWT once on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { setReady(true); return; }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const uid = payload.sub
                || payload.userId
                || payload.nameid
                || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            setUserId(uid ?? null);
        } catch { }
        setReady(true);
    }, []);

    // Merge entityType into items for scoring
    const enrichedItems = useMemo(() =>
        items.map((item) => ({
            ...item,
            entityType: item.entityType ?? (
                item.badge?.toLowerCase() as RecommendedItem["entityType"] ?? "hotel"
            ),
        })),
        [items]
    );

    // Run smart ranking (re-runs whenever userId changes or ready changes)
    const ranked = useMemo(() => {
        if (!ready) return [];
        return smartRank(enrichedItems, userId, limit);
    }, [enrichedItems, userId, ready, limit]);

    const isPersonalized = ready && hasPersonalizationData(userId);

    if (!ready) {
        return (
            <section className="py-10 px-4 container mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Loader2 className="w-5 h-5 text-[#D3A15C] animate-spin" />
                    <h2 className="text-2xl font-bold text-[#0D3B66]">{title}</h2>
                </div>
            </section>
        );
    }

    if (!ranked.length) return null;

    return (
        <section className="py-10 px-4">
            {/* ── Header ── */}
            <div className="container mx-auto mb-6 flex items-center gap-3 flex-wrap">
                {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D3A15C]/20">
                    <Sparkles className="w-4 h-4 text-[#D3A15C]" />
                </div> */}
                <h2 className="bg-[#0D3B66] p-2.5 rounded-xl text-white">{title}</h2>
                {/* <h2 className="text-2xl font-bold text-[#0D3B66]">{title}</h2> */}
                {isPersonalized && (
                    <span className="bg-[#0f4d86] p-1.5 rounded-xl text-white">
                        Personalised for you
                    </span>
                )}
            </div>

            {/* ── Grid ── */}
            <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {ranked.map((item) => {
                    const isFav = favoriteIds.includes(item.id);
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
                                {/* Gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Type badge */}
                                {item.badge && (
                                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-[#D3A15C] text-white px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}

                                {/* Interaction indicators */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    {isFav && (
                                        <span className="bg-white/90 rounded-full p-1">
                                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                        </span>
                                    )}
                                    {item.interacted && !isFav && (
                                        <span className="bg-white/90 rounded-full p-1">
                                            <Eye className="w-3 h-3 text-[#0D3B66]" />
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-3 py-2.5 bg-[#F5E6C8]">
                                <p className="font-semibold text-[#0D3B66] truncate text-sm">{item.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    {item.city || item.country && (
                                        <>
                                            <MapPin className="w-3 h-3 text-gray-700 shrink-0" />
                                            <p className="text-xs text-gray-700 truncate">{item.city || item.country}</p>
                                        </>
                                    )}
                                    {/* City match label */}
                                    {/* {item.cityMatch && isPersonalized && (
                                        <span className="ml-auto text-[9px] font-semibold text-[#D3A15C] bg-[#D3A15C]/10 px-1.5 py-0.5 rounded-full shrink-0">
                                            Your area
                                        </span>
                                    )} */}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
