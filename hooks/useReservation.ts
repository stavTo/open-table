import axios from "axios"
import { Dispatch, SetStateAction, useState } from "react"


export default function useReservation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createReservation = async ({
        slug,
        partySize,
        day,
        time,
        firstName,
        lastName,
        phone,
        email,
        occasion,
        requests,
        setDidBook
    }: {
        slug: string,
        partySize: string,
        day: string,
        time: string
        firstName: string,
        lastName: string,
        phone: string,
        email: string,
        occasion: string,
        requests: string,
        setDidBook: Dispatch<SetStateAction<boolean>>
    }) => {

        setLoading(true)
        try {
            // SAME
            // const response = await axios.get(`/api/restaurant/${slug}/availability?day=${day}&time=${time}&partySize=${partySize}`)
            //1st - endpoint , 2nd - body , 3rd-params
            const response = await axios.post(`/api/restaurant/${slug}/reserve`, {
                firstName,
                lastName,
                phone,
                email,
                occasion,
                requests
            }, {
                params: {
                    day,
                    time,
                    partySize
                }
            })
            setLoading(false)
            setDidBook(true)
            return response.data
        } catch (error: any) {
            setLoading(false)
            setError(error.response.data.errorMessage)
        }
    }

    return { loading, error, createReservation }
}
