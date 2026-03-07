//               GET
import { FavoriteResponse } from "@/interfaces";

const BASE_URL = "http://egyptvoyage.runasp.net/api";

export const getMyFavorites = async (token: string): Promise<FavoriteResponse> => {
    const response = await fetch(`${BASE_URL}/favoritelists/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch favorites");
    }

    return response.json();
};


//             ADD
import { EntityType } from "@/interfaces";

export const addToFavorites = async (token: string, entityId: string, entityType: EntityType) => {
    const response = await fetch(`${BASE_URL}/favoritelists/my/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            entityId,
            entityType,
        }),
    }
    );

    if (!response.ok) {
        throw new Error("Failed to add to favorites");
    }

    return response.json();
};


//            DELETE
export const removeFromFavorites = async (token: string, entityId: string, entityType: EntityType) => {
    const response = await fetch(`${BASE_URL}/favoritelists/my/items?entityType=${entityType}&entityId=${entityId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.log("REMOVE ERROR:", errorText);
        throw new Error(errorText);
    }

    return response;
};


//           SHARE
export const shareFavorites = async (token: string) => {
    const res = await fetch(`${BASE_URL}/favoritelists/my/share`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    }
    );

    if (!res.ok) {
        throw new Error("Failed to generate share link");
    }

    return res.json();
};
