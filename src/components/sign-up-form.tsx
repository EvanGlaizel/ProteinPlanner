import { useState } from "react"
import validator from 'validator';

const SignUpForm = () => 
{
    type FormInput = {
            email: string,
            username: string,
            password: string
        }
    
        const [formInput, setFormInput] = useState<FormInput>({email: '', username: '', password: '',}) 
        const { email, username, password } = formInput;
    
        const handleFormSubmit = (e: React.FormEvent): void => 
        {
            e.preventDefault();

            if (!email.trim() || !username.trim() || !password.trim())
            {
                alert("Fields cannot be blank");
                return;
            }

            if (validator.isEmail(username))
            {
                alert("Username can not be in the form of a valid email");
                return;
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
            <h1 className='text-3xl font-bold text-white text-center mb-2'>Sign Up</h1>
            <h2 className='text-lg text-gray-400 text-center mb-6'>Create a new account</h2>

            <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
                <div>
                    <label className='block text-gray-300 font-medium mb-2'>Email</label>
                    <input 
                        name="email" 
                        type="email" 
                        value={email} 
                        onChange={updateFormInput} 
                        required
                        className='w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
                
                <div>
                    <label className='block text-gray-300 font-medium mb-2'>Username</label>
                    <input 
                        name="username" 
                        type="text" 
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
                        value={password} 
                        onChange={updateFormInput} 
                        required 
                        minLength={6}
                        className='w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>

                <button 
                    type="submit"
                    className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md mt-4 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    Sign Up
                </button>
            </form>
        </div>
        )
}

export default SignUpForm;