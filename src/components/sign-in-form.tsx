import { useState } from "react"

const SignInForm = () => 
{
    type FormInput = {
        username: string,
        password: string
    }

    const [formInput, setFormInput] = useState<FormInput>({username: '', password: '',}) 
    const { username, password } = formInput;

    const handleFormSubmit = (): void => 
    {
        if (!username.trim() || !password.trim())
        {
            alert("Fields cannot be blank");
        }
    }

    const updateFormInput = (e: React.ChangeEvent<HTMLInputElement>): void => 
    {
        const { name, value } = e.target;

        setFormInput((prev) => 
        ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <>
            <h1>Already Have an Account?</h1>
            <h2>Sign In With Your Username and Password</h2>

            <form onSubmit={handleFormSubmit}>
                <label>Username
                    <input type="text" value={username} onChange={updateFormInput} required minLength={2}/>
                </label>

                <label>Password
                    <input type="text" value={password} onChange={updateFormInput} required minLength={4}/>
                </label>

                <button type="submit">Sign Up</button>
            </form>

        </>
    )
}

export default SignInForm;