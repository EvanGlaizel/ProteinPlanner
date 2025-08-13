import { useState, useContext } from "react"
import { UserContext } from '../contexts/user.context.tsx'

const SignInForm = () => 
{
    type FormInput = {
        username: string,
        password: string
    }

    const [formInput, setFormInput] = useState<FormInput>({username: '', password: '',}) 
    const { username, password } = formInput;
    
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { login } = useContext(UserContext);

    const handleFormSubmit = async (e: React.FormEvent): void => 
    {
        e.preventDefault();

        if (!username.trim() || !password.trim())
        {
            setErrorMessage("Fields cannot be blank");
            return;
        }

        const result = await login(username, password);

        if (result === 'true')
        {
            setFormInput({username: '', password: ''});
        }
        else if (result !== 'false')
        {
            setErrorMessage(result);
        }

        return;
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
        <div className='w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg shadow-black/30'>
            <h1 className='text-3xl font-bold text-white text-center mb-2'>Sign In</h1>
            <h2 className='text-lg text-gray-400 text-center mb-6'>Already have an account?</h2>

            <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
                <div>
                    <label className='block text-gray-300 font-medium mb-2'>Username or Email</label>
                    <input 
                        name="username" 
                        type="text" 
                        autoComplete="username"
                        value={username} 
                        onChange={updateFormInput} 
                        required 
                        minLength={2}
                        className='w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <div>
                    <label className='block text-gray-300 font-medium mb-2'>Password</label>
                    <input 
                        name="password" 
                        type="password" 
                        autoComplete="current-password"
                        value={password} 
                        onChange={updateFormInput} 
                        required 
                        minLength={6}
                        className='w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                {errorMessage !== '' && <p className='text-red-400 text-sm font-medium mt-1 mb-2 text-center'>{errorMessage}</p>}

                <button 
                    type="submit"
                    className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md mt-4 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Sign In
                </button>
            </form>
        </div>
    )
}

export default SignInForm;