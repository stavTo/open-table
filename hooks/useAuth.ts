import axios from "axios"
import { useContext } from "react"
import { authenticationContext } from "../app/context/AuthContext"
import { deleteCookie } from 'cookies-next'
const useAuth = () => {

    const { setAuthState } = useContext(authenticationContext)

    const signin = async (email: string, password: string, handleClose: () => void) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        })
        try {
            const response = await axios.post('/api/auth/signin', {
                email,
                password
            })
            setAuthState({
                data: response.data,
                error: null,
                loading: false
            })
            handleClose()
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            })
        }
    }
    const signup = async (
        inputs: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone: string;
            city: string;
        },
        handleClose: () => void) => {
        setAuthState({
            data: null,
            error: null,
            loading: true
        })
        try {
            const response = await axios.post('/api/auth/signup', inputs)
            setAuthState({
                data: response.data,
                error: null,
                loading: false
            })
            handleClose()
        } catch (error: any) {
            setAuthState({
                data: null,
                error: error.response.data.errorMessage,
                loading: false
            })
        }
    }

    const signout = () => {
        deleteCookie("jwt")
        setAuthState({
            data: null,
            error: null,
            loading: false
        })
    }

    return {
        signin,
        signup,
        signout
    }
}

export default useAuth