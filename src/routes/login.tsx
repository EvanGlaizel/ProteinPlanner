import SignInForm from "../components/sign-in-form";
import SignUpForm from "../components/sign-up-form";

const Login = () => 
{
    return (<div className='min-h-screen bg-gray-800 text-gray-300 flex flex-col md:flex-row justify-center items-center gap-64 p-4'>
                <SignInForm/>
                <SignUpForm/>
            </div>)
}

export default Login;