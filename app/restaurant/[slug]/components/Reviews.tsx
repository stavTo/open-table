import { Review } from "@prisma/client";
import ReviewCard from "./ReviewCard";

export default function Reviews({ reviews }: { reviews: Review[] }) {
    return (
        <div>
            <div>
                <h1 className="font-bold text-3xl mt-10 mb-7 borber-b pb-5">
                    What {reviews.length} people are saying
                </h1>
                {reviews.length
                    ?
                    reviews.map(review => <ReviewCard key={review.id} review={review} />)
                    :
                    <p>There are no reviews</p>
                }
            </div>
        </div>
    )
}