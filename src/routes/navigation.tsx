import { Link, Outlet } from 'react-router-dom'
import ProfileDropdown from '../components/profile-dropdown';

import { CgProfile } from "react-icons/cg";
import { useState, useContext } from 'react';

import { UserContext } from '../contexts/user.context';

const Navigation = () => 
{
    const [isProfileClicked, setProfileClicked] = useState(false);

    // User context
    const userContext = useContext(UserContext);
    if (!userContext) { throw new Error("Error: userContext is undefined") }
    const { currentUser } = userContext;

    const toggleCart = (): void => 
    {
        setProfileClicked(!isProfileClicked);
    }

  return (
    <>
        <nav className="w-full bg-gray-900 flex items-center py-4 px-6 shadow-md shadow-black/50 rounded-b-lg transition-colors duration-300 ease-in-out">
            <div className='flex flex-grow justify-start items-center gap-x-8 mx-5'>
                <Link className="text-2xl font-semibold mx-5 !text-gray-300 hover:!text-blue-400 transition-colors duration-200" to="/dashboard">Dashboard</Link>
                <Link className="text-2xl font-semibold mx-5 !text-gray-300 hover:!text-blue-400 transition-colors duration-200" to="/history">History</Link>
            </div>

            {currentUser == null ? 
                                    <Link className="text-2xl font-semibold mx-5 !text-gray-300 hover:!text-blue-400 transition-colors duration-200" to="/login">Sign In</Link> :
                                    <CgProfile onClick={toggleCart} className='text-6xl text-white p-1 rounded-full hover:text-blue-400 hover:cursor-pointer transition-all duration-200 ml-auto'/>
            }
            
        </nav>
        
        {isProfileClicked && <ProfileDropdown/>}

        <Outlet/>
    </>
  )
}

export default Navigation;