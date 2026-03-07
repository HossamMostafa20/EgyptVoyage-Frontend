import FavoritesGrid from "@/components/FavoritesGrid/FavoritesGrid";
import FavoriteCard from "@/components/FavoriteCard/FavoriteCard";

export default async function SharedFavoritesPage({ params }: any) {

    const { shareToken } = await params;
    console.log("TOKEN:", params);

    const res = await fetch(`http://egyptvoyage.runasp.net/api/favoritelists/shared/${shareToken}`,
        { cache: "no-store" }
    );

    const data = await res.json();
    console.log("DATA:", data);

    if (data.message) {
        return <>
            <div className="text-center mt-20 text-red-500 text-lg">
                {data.message}
            </div>
        </>
    }

    return <>
        <div className="container mx-auto p-6">

            <h1 className="text-3xl font-bold text-center text-[#0D3B66] mb-6">Shared Favorites</h1>

            <FavoritesGrid>

                {data.hotels.map((hotel: any) => (
                    <FavoriteCard
                        key={`hotel-${hotel.id}`}
                        id={hotel.id}
                        entityType="hotel"
                        title={hotel.hotelName}
                        city={hotel.location.city}
                        description={hotel.description}
                        image={hotel.imageCover}
                        showFavoriteButton={false}
                    />
                ))}

                {data.landmarks.map((landmark: any) => (
                    <FavoriteCard
                        key={`landmark-${landmark.id}`}
                        id={landmark.id}
                        entityType="landmark"
                        title={landmark.landmarkName}
                        city={landmark.location.city}
                        description={landmark.description}
                        image={landmark.imageCover}
                        rating={landmark.rating}
                        showFavoriteButton={false}
                    />
                ))}

                {data.restaurants.map((restaurant: any) => (
                    <FavoriteCard
                        key={`restaurant-${restaurant.id}`}
                        id={restaurant.id}
                        entityType="restaurant"
                        title={restaurant.restaurantName}
                        city={restaurant.location.city}
                        description={restaurant.cuisineType}
                        image={restaurant.imageCover}
                        rating={restaurant.rating}
                        showFavoriteButton={false}
                    />
                ))}

                {data.programs.map((program: any) => (
                    <FavoriteCard
                        key={`program-${program.id}`}
                        id={program.id}
                        entityType="program"
                        title={program.name}
                        city={program.country}
                        description={program.description}
                        image={program.imageCover}
                        showFavoriteButton={false}
                    />
                ))}

            </FavoritesGrid>

        </div>
    </>
}
