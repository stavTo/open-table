import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "../../../../services/restaurant/findAvailableTables";

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const { day, slug, partySize, time } = req.query as {
            slug: string
            day: string
            partySize: string
            time: string
        }

        if (!day || !partySize || !time) {
            return res.status(400).json({
                errorMessage: 'Invalid data provided'
            })
        }

        const restaurant = await prisma.restaurant.findUnique({
            where: {
                slug
            },
            select: {
                tables: true,
                open_time: true,
                close_time: true
            }
        })
        if (!restaurant) {
            return res.status(400).json({
                errorMessage: 'Invalid data provided'
            })
        }

        const searchTimesWithTables = await findAvailableTables({ time, day, res, restaurant })

        if (!searchTimesWithTables) {
            return res.status(400).json({
                errorMessage: 'Invalid data provided'
            })
        }

        const availabilities = searchTimesWithTables.map(t => {
            const sumSeats = t.tables.reduce((sum, table) => {
                return sum + table.seats
            }, 0)
            return {
                time: t.time,
                available: sumSeats >= parseInt(partySize)
            }
        })
            .filter(availability => {
                const timeIsAfterOpening = new Date(`${day}T${availability.time}`) >= new Date(`${day}T${restaurant.open_time}`)
                const timeIsBeforeClosing = new Date(`${day}T${availability.time}`) <= new Date(`${day}T${restaurant.close_time}`)
                return timeIsAfterOpening && timeIsBeforeClosing
            })

        return res.json(availabilities)
    }
}

// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-08-30&time=17:00:00.000Z&partySize=4
// http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-08-30&time=17:00:00.000Z&partySize=4
