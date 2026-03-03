export type ReviewEntityType = "Hotel" | "Landmark" | "Restaurant" | "Program";

export interface CreateReviewPayloadI {
    entityId: string;
    entityType: ReviewEntityType;
    rating: number;
    comment: string;
}

export interface ReviewI {
    id: string;
    touristId: string;
    entityId: string;
    entityType: ReviewEntityType;
    rating: number;
    comment: string;
    createdAt: string;
    touristName?: string;
}
