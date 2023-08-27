import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient()
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {
        const { day, slug, partySize, time } = req.query as {
            slug: string
            day: string
            partySize: string
            time: string
        }

        const { email, phone, lastName, firstName
            , occasion, requests } = req.body

        const restaurant = await prisma.restaurant.findUnique({
            where: {
                slug
            },
            select: {
                tables: true,
                open_time: true,
                close_time: true,
                id: true
            }
        })

        if (!restaurant) {
            return res.status(400).json({
                errorMessage: 'Restaurant not found'
            })
        }
        if (new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
            new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
        ) {
            return res.status(400).json({
                errorMessage: 'Restaurant is not open at that time'
            })
        }

        const searchTimesWithTables = await findAvailableTables({ time, day, res, restaurant })

        if (!searchTimesWithTables) {
            return res.status(400).json({
                errorMessage: 'Invalid data provided'
            })
        }
        const searchTimeWithTables = searchTimesWithTables.find(t => {
            return t.date.toISOString() === new Date(`${day}T${time}`).toISOString()
        })

        if (!searchTimeWithTables) {
            return res.status(400).json({
                errorMessage: 'No availability, cannot book'
            })
        }

        const tablesCount: {
            2: number[]
            4: number[]
        } = {
            2: [],
            4: [],
        }

        searchTimeWithTables.tables.forEach(table => {
            if (table.seats === 2) {
                tablesCount[2].push(table.id)
            } else tablesCount[4].push(table.id)
        })

        const tablesToBooks: number[] = []
        let seatsRemaining = parseInt(partySize)

        while (seatsRemaining > 0) {
            if (seatsRemaining >= 3) {
                if (tablesCount[4].length) {
                    tablesToBooks.push(tablesCount[4][0])
                    tablesCount[4].shift()
                    seatsRemaining = seatsRemaining - 4
                } else {
                    tablesToBooks.push(tablesCount[2][0])
                    tablesCount[2].shift()
                    seatsRemaining = seatsRemaining - 2
                }
            } else {
                if (tablesCount[2].length) {
                    tablesToBooks.push(tablesCount[2][0])
                    tablesCount[2].shift()
                    seatsRemaining = seatsRemaining - 2
                } else {
                    tablesToBooks.push(tablesCount[4][0])
                    tablesCount[4].shift()
                    seatsRemaining = seatsRemaining - 4
                }
            }
        }

        const booking = await prisma.booking.create({
            data: {
                number_of_people: parseInt(partySize),
                booking_time: new Date(`${day}T${time}`),
                booker_email: email,
                booker_phone: phone,
                booker_first_name: firstName,
                booker_last_name: lastName,
                restaurant_id: restaurant.id,
                booker_occasion: occasion,
                booker_request: requests
            }
        })

        // console.log(booking)

        const bookingsOnTablesData = tablesToBooks.map(table_id => {
            return {
                table_id,
                booking_id: booking.id
            }
        })

        await prisma.bookingsOnTables.createMany({
            data: bookingsOnTablesData
        })


        return res.json({
            booking
        })
    }

}