'use client'

import Link from "next/link";
import { useContext } from "react";
import useAuth from "../../hooks/useAuth";
import { authenticationContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";

export default function NavBar() {
    const { data, loading } = useContext(authenticationContext)
    const { signout } = useAuth()
    return (
        <nav className="bg-white p-2 flex justify-between">
            <Link href="" className="font-bold text-gray-700 text-2xl"> OpenTable </Link>
            <div>
                <div className="flex">

                    {loading ? null : data ?
                        (<button onClick={signout} className="bg-blue-400 text-white border p-1 px-4 rounded mr-3">
                            Sign out
                        </button>)
                        :
                        (<>
                            <AuthModal isSignIn={true} />
                            <AuthModal isSignIn={false} />
                        </>)
                    }
                </div>
            </div>
        </nav>
    )
}