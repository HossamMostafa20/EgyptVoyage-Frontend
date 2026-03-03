import type { CreateReviewPayloadI, ReviewI } from "@/interfaces/review";
import { getToken } from "@/lib/authToken";

const BASE_URL = "http://egyptvoyage.runasp.net";


//                 GET
export async function getReviews(): Promise<ReviewI[]> {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/Reviews`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch reviews");
    }

    return res.json();
}


//                CREATE
export async function createReview(payload: CreateReviewPayloadI): Promise<ReviewI> {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/api/Reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Create review failed: ${res.status} ${text}`);
    }

    return res.json();
}

//               DELETE
export async function deleteReview(id: string) {
    const token = getToken();

    const res = await fetch(`http://egyptvoyage.runasp.net/api/Reviews/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    );

    if (!res.ok) {
        throw new Error("Failed to delete review");
    }
}
