import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurantCard from "./components/RestaurantCard";
import { PRICE, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface searchParams {
    city?: string,
    cuisine?: string,
    price?: PRICE
}


function fetchRestaurantsByParams(searchParams: searchParams) {
    const where: any = {}
    const { city, cuisine, price } = searchParams
    if (city) {
        where.location = {
            name: {
                equals: city.toLowerCase()
            }
        }
    }
    if (cuisine) {
        where.cuisine = {
            name: {
                equals: cuisine.toLowerCase()
            }
        }
    }
    if (price) {
        where.price = { equals: price }
    }
    
    const select = {
        id: true,
        name: true,
        main_image: true,
        price: true,
        cuisine: true,
        location: true,
        slug: true,
        reviews: true
    }
    return prisma.restaurant.findMany({
        where,
        select
    })
}

async function fetchLocations() {
    return prisma.location.findMany()
}

async function fetchCuisines() {
    return prisma.cuisine.findMany()
}

export default async function Search({ searchParams }: { searchParams: searchParams }) {
    const restaurants = await fetchRestaurantsByParams(searchParams)
    const locations = await fetchLocations()
    const cuisines = await fetchCuisines()
    return (
        <>
            <Header />
            <div className="flex py-4 m-auto w-2/3 justify-between items-start">
                <SearchSideBar
                    searchParams={searchParams}
                    locations={locations}
                    cuisines={cuisines}
                />
                {restaurants.length ?
                    <div className="w-5/6">
                        {restaurants.map(restaurant => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                            />))}
                    </div>
                    :
                    <p className="w-5/6">Sorry, we found no restaurants in this area</p>
                }
            </div>
        </>
    )
}