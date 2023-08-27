import { Review } from "@prisma/client";


export function calculateReviewAvg(reviews: Review[]) {
    if (!reviews.length) return 0
    return (reviews.reduce((acc, review) => acc + review.rating, 0)) / reviews.length
}
