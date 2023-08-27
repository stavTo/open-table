'use client'

import { CircularProgress } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import useReservation from "../../../../hooks/useReservation"

export default function Form({
    slug,
    date,
    partySize,

}:
    {
        slug: string,
        date: string,
        partySize: string
    }) {
    const [disabled, setDisabled] = useState(true)
    const [didBook, setDidBook] = useState(false)
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        occasion: '',
        requests: ''
    })
    const { error, loading, createReservation } = useReservation()
    const [day, time] = date.split('T')
    useEffect(() => {
        if (inputs.firstName && inputs.lastName && inputs.email && inputs.phone) {
            return setDisabled(false)
        } else {
            return setDisabled(true)
        }
    }, [inputs])

    const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [ev.target.name]: ev.target.value })
    }

    const handleClick = async () => {
        const booking = await createReservation({
            slug,
            partySize,
            time,
            day,
            firstName: inputs.firstName,
            lastName: inputs.lastName,
            phone: inputs.phone,
            email: inputs.email,
            occasion: inputs.occasion,
            requests: inputs.requests,
            setDidBook
        })
    }

    return (
        <div className="mt-10 flex flex-wrap justify-between w-[660px]">
            {didBook ?
                <div>
                    <h1>You are all booked up</h1>
                    <p>Enjoy your reservation</p>
                </div>
                : (<>
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="First name"
                        value={inputs.firstName}
                        name='firstName'
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="Last name"
                        value={inputs.lastName}
                        name='lastName'
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="Phone number"
                        value={inputs.phone}
                        name='phone'
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="Email"
                        value={inputs.email}
                        name='email'
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="Occasion (optional)"
                        value={inputs.occasion}
                        name='occasion'
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        className="border rounded p-3 w-80 mb-4"
                        placeholder="Requests (optional)"
                        value={inputs.requests}
                        name='requests'
                        onChange={handleChange}
                    />
                    <button
                        disabled={disabled || loading}
                        onClick={handleClick}
                        className="bg-red-600 w-full p-3 text-white font-bold rounded disabled:bg-gray-300"
                    >
                        {loading ? <CircularProgress color="inherit" /> : 'Complete reservation'}
                    </button>
                    <p className="mt-4 text-sm">
                        By clicking “Complete reservation” you agree to the OpenTable Terms
                        of Use and Privacy Policy. Standard text message rates may apply.
                        You may opt out of receiving text messages at any time.
                    </p>
                </>
                )}
        </div>
    )
}