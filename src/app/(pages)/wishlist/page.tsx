"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Share2 } from "lucide-react";
import FavoritesTabs from "@/components/FavoritesTabs/FavoritesTabs";
import FavoritesGrid from "@/components/FavoritesGrid/FavoritesGrid";
import FavoriteCard from "@/components/FavoriteCard/FavoriteCard";
import { getMyFavorites, shareFavorites } from "@/services/favorite.service";
import { FavoriteResponse } from "@/interfaces";
import Loading from "@/app/loading";
import { useFavorites } from "@/context/FavoriteContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type TabValue = "all" | "hotels" | "landmarks" | "restaurants" | "programs";

export default function FavoritesPage() {

  const { favorites } = useFavorites();

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const [data, setData] = useState<FavoriteResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        } else {
          setAuthorized(true);
        }

        const result = await getMyFavorites(token);
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const result = await shareFavorites(token);
      console.log(result.shareLink);

      const shareToken = result?.shareLink?.split("/").pop()

      const frontendLink = `http://localhost:3000/shared/${shareToken}`

      navigator.clipboard.writeText(frontendLink)

      toast.success("Share link copied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to share favorites");
    }
  };


  const content = useMemo(() => {
    if (!data) return null;

    const favoriteHotels = data.hotels.filter(h => favorites.hotel.includes(h.id));

    const favoriteLandmarks = data.landmarks.filter(l => favorites.landmark.includes(l.id));

    const favoriteRestaurants = data.restaurants.filter(r => favorites.restaurant.includes(r.id));

    const favoritePrograms = data.programs.filter(p => favorites.program.includes(p.id));

    if (activeTab === "all") {
      return (
        <>
          {favoriteHotels.map((hotel) => (
            <FavoriteCard
              key={`hotel-${hotel.id}`}
              id={hotel.id}
              entityType="hotel"
              title={hotel.hotelName}
              city={hotel.location.city}
              description={hotel.description}
              image={hotel.imageCover}
            />
          ))}

          {favoriteLandmarks.map((landmark) => (
            <FavoriteCard
              key={`landmark-${landmark.id}`}
              id={landmark.id}
              entityType="landmark"
              title={landmark.landmarkName}
              city={landmark.location.city}
              description={landmark.description}
              image={landmark.imageCover}
              rating={landmark.rating}
            />
          ))}

          {favoriteRestaurants.map((restaurant) => (
            <FavoriteCard
              key={`restaurant-${restaurant.id}`}
              id={restaurant.id}
              entityType="restaurant"
              title={restaurant.restaurantName}
              city={restaurant.location.city}
              description={restaurant.cuisineType}
              image={restaurant.imageCover}
              rating={restaurant.rating}
            />
          ))}

          {favoritePrograms.map((program) => (
            <FavoriteCard
              key={`program-${program.id}`}
              id={program.id}
              entityType="program"
              title={program.name}
              city={program.country}
              description={program.description}
              image={program.imageCover}
            />
          ))}
        </>
      );
    }


    if (activeTab === "hotels") {
      return favoriteHotels.map((hotel) => (
        <FavoriteCard
          key={`hotel-${hotel.id}`}
          id={hotel.id}
          entityType="hotel"
          title={hotel.hotelName}
          city={hotel.location.city}
          description={hotel.description}
          image={hotel.imageCover}
        />
      ));
    }

    if (activeTab === "landmarks") {
      return favoriteLandmarks.map((landmark) => (
        <FavoriteCard
          key={`landmark-${landmark.id}`}
          id={landmark.id}
          entityType="landmark"
          title={landmark.landmarkName}
          city={landmark.location.city}
          description={landmark.description}
          image={landmark.imageCover}
          rating={landmark.rating}
        />
      ));
    }

    if (activeTab === "restaurants") {
      return favoriteRestaurants.map((restaurant) => (
        <FavoriteCard
          key={`restaurant-${restaurant.id}`}
          id={restaurant.id}
          entityType="restaurant"
          title={restaurant.restaurantName}
          city={restaurant.location.city}
          description={restaurant.cuisineType}
          image={restaurant.imageCover}
          rating={restaurant.rating}
        />
      ));
    }

    return favoritePrograms.map((program) => (
      <FavoriteCard
        key={`program-${program.id}`}
        id={program.id}
        entityType="program"
        title={program.name}
        city={program.country}
        description={program.description}
        image={program.imageCover}
      />
    ));
  }, [data, activeTab, favorites]);



  const itemsCount = useMemo(() => {
    if (!data) return 0;

    const favoriteHotels = data.hotels.filter(h => favorites.hotel.includes(h.id));
    const favoriteLandmarks = data.landmarks.filter(l => favorites.landmark.includes(l.id));
    const favoriteRestaurants = data.restaurants.filter(r => favorites.restaurant.includes(r.id));
    const favoritePrograms = data.programs.filter(p => favorites.program.includes(p.id));

    if (activeTab === "all") {
      return (
        favoriteHotels.length +
        favoriteLandmarks.length +
        favoriteRestaurants.length +
        favoritePrograms.length
      );
    }

    if (activeTab === "hotels") return favoriteHotels.length;
    if (activeTab === "landmarks") return favoriteLandmarks.length;
    if (activeTab === "restaurants") return favoriteRestaurants.length;

    return favoritePrograms.length;

  }, [data, activeTab, favorites]);



  if (loading) return <Loading />;

  if (!data)
    return <p className="text-center p-6">No favorites found</p>;

  return <>
    <div className="flex items-center justify-center p-3">
      <h1 className="text-3xl font-bold text-[#0D3B66] flex items-center gap-2">
        My Favorites
        <Heart className="size-8 text-[#0D3B66] fill-current" />
      </h1>

      <Button onClick={handleShare} className="absolute right-3 bg-[#0D3B66] text-white flex items-center gap-2 cursor-pointer">
        <Share2 className="size-4" />
        Share
      </Button>
    </div>

    {/* Tabs */}
    <div className="flex justify-center mb-5">
      <FavoritesTabs value={activeTab} onChange={setActiveTab} />
    </div>

    {/* Grid */}
    {/* <FavoritesGrid>{content}</FavoritesGrid> */}

    {itemsCount === 0 ? (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        {/* <Heart className="size-16 text-[#D3A15C] mb-4 opacity-70" /> */}
        <h2 className="text-2xl font-semibold text-[#0D3B66]">No Favorites Yet</h2>
        <p className="text-gray-800 text-lg mt-2">Start exploring and add your favorite places.</p>
      </div>
    ) : (
      <FavoritesGrid>{content}</FavoritesGrid>
    )}
  </>
}



// import ProtectedRoute from '@/components/Protected/ProtectedRoute'
// import { Button } from '@/components/ui/button'
// import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Heart, HeartIcon } from 'lucide-react'
// import Image from 'next/image'
// import React from 'react'

// export default function Wishlist() {
//   return <>
//     <ProtectedRoute>
//       <h1 className="text-3xl font-bold text-[#0D3B66] flex items-center justify-center gap-2 p-3">My Favorites<Heart className="size-8 text-[#0D3B66] fill-current" /> </h1>
//       <div className='container mx-auto p-2 lg:p-1.5 xl:p-2 md:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch'>
//         <div className='p-0.5'>
//           <Card className="flex flex-col h-full transform transition-all duration-500 hover:shadow-[0_0_13px_rgba(0,0,0,0.15)] hover:shadow-black">
//             <Image src='/img3.jpg' className='w-full h-48 rounded-t-xl object-cover' alt='' width={500} height={500} />
//             <CardHeader className="grow">
//               <div className="flex items-center mt-2.5 justify-between">
//                 <CardTitle>Zaitouni Restaurant</CardTitle>
//                 <CardAction>Cairo</CardAction>
//               </div>
//               <div className='flex mt-2'>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#D3A15C]">
//                   <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//                 </svg>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#D3A15C]">
//                   <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//                 </svg>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#D3A15C]">
//                   <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//                 </svg>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#D3A15C]">
//                   <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//                 </svg>
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-[#D3A15C]">
//                   <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
//                 </svg>
//                 <div className='ms-2 text-white'>(5)</div>
//               </div>
//               <CardDescription className='mt-2.5'>
//                 Text" refers to written or printed matter, the words of a book, or an electronic message, but it can also refer to any readable object like a street sign, painting,
//                 or even clothing, according to a literary theory definition. In
//               </CardDescription>
//             </CardHeader>
//             <Button className='cursor-pointer mt-2.5 mx-7 mb-5 bg-linear-to-b from-[#D3A15C] to-[#00000055]'><HeartIcon /> Add To Favourite</Button>
//           </Card>
//         </div>
//       </div>
//     </ProtectedRoute>
//   </>
// }
