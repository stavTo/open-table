'use client'

import { ReactNode, useState, createContext, Dispatch, SetStateAction, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import axios from 'axios'
interface User {
    id: number
    firstName: string
    lastName: string
    city: string
    password: string
    email: string
    phone: string
}

interface State {
    loading: boolean
    data: User | null,
    error: string | null
}

interface AuthState extends State {
    setAuthState: Dispatch<SetStateAction<State>>
}

export const authenticationContext = createContext<AuthState>({
    loading: false,
    data: null,
    error: null,
    setAuthState: () => { }
})

export default function AuthContext({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<State>({
        loading: true,
        data: null,
        error: null
    })

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        })
        try {
            const jwt = getCookie('jwt')
            if (!jwt) {
                return setAuthState({
                    data: null,
                    error: null,
                    loading: false
                })
            }
            const res = await axios.get('/api/auth/me', {
                headers: {
                    Authorization: `bearer ${jwt}`
                }
            })

            axios.defaults.headers.common["Authorization"] = `bearer ${jwt}`

            setAuthState({
                data: res.data,
                error: null,
                loading: false
            })

        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            })
        }
    }

    return (
        <authenticationContext.Provider value={{
            ...authState, setAuthState
        }}>
            {children}
        </authenticationContext.Provider>
    )
}

