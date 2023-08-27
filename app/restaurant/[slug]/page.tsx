import RestaurantNavBar from "./components/RestaurantNavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import { PrismaClient, Review } from "@prisma/client";

const prisma = new PrismaClient()

interface Restaurant {
    id: number;
    name: string;
    images: string[];
    description: string;
    slug: string;
    reviews: Review[],
    open_time: string,
    close_time: string
}

async function fetchRestaurantsBySlug(slug: string): Promise<Restaurant> {
    const restaurant = await prisma.restaurant.findUnique({
        where: {
            slug
        },
        select: {
            id: true,
            name: true,
            images: true,
            description: true,
            slug: true,
            reviews: true,
            open_time: true,
            close_time: true
        }
    })
    if (!restaurant) throw new Error()
    return restaurant
}

export default async function RestaurantDetails({ params }: { params: { slug: string } }) {
    const restaurant = await fetchRestaurantsBySlug(params.slug)
    const { slug, description, name, images, reviews, close_time, open_time } = restaurant
    return (
        <>
            <div className="bg-white w-[70%] rounded p-3 shadow">
                <RestaurantNavBar slug={slug} />
                <Title name={name} />
                <Rating reviews={reviews} />
                <Description description={description} />
                <Images images={images} />
                <Reviews reviews={reviews} />
            </div>
            <div className="w-[27%] relative text-reg">
                <ReservationCard
                    slug={slug}
                    openTime={open_time}
                    closeTime={close_time}
                />
            </div>
        </>
    )
}