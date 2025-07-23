import { Link, Outlet } from 'react-router-dom'
import ProfileDropdown from '../components/profile-dropdown';

import { CgProfile } from "react-icons/cg";
import { useState } from 'react';

const Navigation = () => 
{
    const [isProfileClicked, setProfileClicked] = useState(false);

    const toggleCart = (): void => 
    {
        setProfileClicked(!isProfileClicked);
    }

  return (
    <>
        <nav className="w-full bg-white flex items-center py-4 px-6 shadow-md rounded-b-lg">
            <div className='flex flex-grow justify-start items-center gap-x-8 mx-5'>
                <Link className="text-2xl font-semibold mx-5 text-gray-700 hover:text-blue-600 transition-colors duration-200" to="/dashboard">Dashboard</Link>
                <Link className="text-2xl font-semibold mx-5 text-gray-700 hover:text-blue-600 transition-colors duration-200" to="/history">History</Link>
            </div>

            <CgProfile onClick={toggleCart} className='text-6xl text-black p-1 rounded-full hover:bg-gray-200 hover:cursor-pointer transition-all duration-200 ml-auto'/>
        </nav>
        
        {isProfileClicked && <ProfileDropdown/>}

        <Outlet/>
    </>
  )
}

export default Navigation;