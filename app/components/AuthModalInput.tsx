
interface Props {
    inputs: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phone: string,
        city: string
    }
    handleChangeInput: (ev: React.ChangeEvent<HTMLInputElement>) => void
    isSignIn: boolean
}
export default function AuthModalInput({ inputs, handleChangeInput, isSignIn }: Props) {
    const { firstName,
        lastName,
        email,
        password,
        phone,
        city } = inputs
    return (
        <div>
            {isSignIn ? null : <div className="my-3 flex justify-between text-sm">
                <input
                    className="border rounded p-2 py-3 w-[49%]"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleChangeInput}
                    name={'firstName'}
                />
                <input
                    className="border rounded p-2 py-3 w-[49%]"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleChangeInput}
                    name={'lastName'}
                />
            </div>}
            <div className="my-3 flex justify-between text-sm">
                <input
                    className="border rounded p-2 py-3 w-full"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleChangeInput}
                    name={'email'}
                />
            </div>
            {isSignIn ? null : <div className="my-3 flex justify-between text-sm">
                <input
                    className="border rounded p-2 py-3 w-[49%]"
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={handleChangeInput}
                    name={'phone'}
                />
                <input
                    className="border rounded p-2 py-3 w-[49%]"
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={handleChangeInput}
                    name={'city'}
                />
            </div>}
            <div className="my-3 flex justify-between text-sm">
                <input
                    className="border rounded p-2 py-3 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChangeInput}
                    name={'password'}
                />
            </div>
        </div>
    )
}
