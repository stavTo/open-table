'use client'

import { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AuthModalInput from './AuthModalInput';
import useAuth from '../../hooks/useAuth';
import { authenticationContext } from '../context/AuthContext';
import { Alert, CircularProgress } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function AuthModal({ isSignIn }: { isSignIn: boolean }) {
    const [open, setOpen] = useState(false);
    const { signin, signup } = useAuth()
    const { data, error, loading } = useContext(authenticationContext)
    const [disabled, setDisabled] = useState(true)
    const [inputs, setInputs] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        city: ''
    })

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const renderContent = (signinContent: string, signupContent: string) => {
        return isSignIn ? signinContent : signupContent
    }


    useEffect(() => {
        if (isSignIn) {
            if (inputs.email && inputs.password) {
                setDisabled(false)
                return
            }
        } else {
            if (inputs.email && inputs.password && inputs.phone && inputs.city && inputs.firstName && inputs.lastName) {
                setDisabled(false)
                return
            }
        }
    }, [inputs])

    const handleChangeInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({
            ...inputs,
            [ev.target.name]: ev.target.value
        })
    }
    const handleClick = () => {
        isSignIn ?
            signin(inputs.email, inputs.password, handleClose)
            :
            signup(inputs, handleClose)
    }

    return (
        <div>
            <button
                onClick={handleOpen}
                className={`${renderContent('bg-blue-400 text-white', '')} border p-1 px-4 rounded mr-3`} >
                {renderContent('Sign in', 'Sign up')}
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {loading ?
                        <div className='p-24 h-[600px] flex justify-center'>
                            <CircularProgress />
                        </div>
                        :
                        <div className="p-2 h-[600px]">
                            {error ? <Alert className='mb-4' severity='error'>
                                {error}
                            </Alert>
                                :
                                null}
                            <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                                <p className="text-sm">
                                    {renderContent('Sign in', 'Create Account ')}
                                </p>
                                <p>
                                    {data?.firstName} {data?.lastName}
                                </p>
                            </div>
                            <div className="m-auto">
                                <h2 className="text-2xl font-light text-center">
                                    {renderContent('Log Into Your Account', 'Create Your Open Table Account')}
                                </h2>
                                <AuthModalInput
                                    isSignIn={isSignIn}
                                    inputs={inputs}
                                    handleChangeInput={handleChangeInput} />
                                <button
                                    disabled={disabled}
                                    onClick={handleClick}
                                    className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400">
                                    {renderContent('Sign In', 'Create Account')}
                                </button>
                            </div>
                        </div>}
                </Box>
            </Modal>
        </div>
    );
}