import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function Navbar() {

    let { User, SetUser } = useContext(UserContext);
    console.log(User);
    
    let navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function handleLogout() {

        localStorage.removeItem('UserToken');
        localStorage.removeItem('UserData');
        SetUser(null);
        navigate('/')

    }
    return (
        <nav className="bg-neutral-primary fixed top-0 left-0 w-full z-50 border-b border-default bg-gray-300">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-7" alt="Flowbite Logo" />
                    <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Social App</span>
                </a>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
                    {User !== null && <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary" id="user-menu-button" aria-expanded={isDropdownOpen}>
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src={User?.user?.photo} alt="user photo" />
                    </button>}
                    {User === null && <div className="flex gap-2">
                        <NavLink to="SignIn" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Sign In</NavLink>
                        <NavLink to="SignUp" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Sign Up</NavLink>
                    </div>}
                    {User !== null && <div className={`absolute top-12 right-0 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44 ${isDropdownOpen ? 'block' : 'hidden'}`} id="user-dropdown">
                        <div className="px-4 py-3 text-sm border-b border-default flex items-center gap-3">
                            <img className="w-10 h-10 rounded-full" src={User?.user?.photo} alt="user profile" />
                            <div>
                                <span className="block text-heading font-medium">{User?.user?.name || 'User'}</span>
                                <span className="block text-body  text-xs">{User?.user?.email || 'email@example.com'}</span>
                            </div>
                        </div>
                        <ul className="p-2 text-sm text-body font-medium" aria-labelledby="user-menu-button">
                            <li>
                                <a href="#" onClick={() => setIsDropdownOpen(false)} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => setIsDropdownOpen(false)} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Settings</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => setIsDropdownOpen(false)} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Earnings</a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => {e.preventDefault(); handleLogout()}} className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded">Sign out</a>
                            </li>
                        </ul>
                    </div>}
                    <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-user" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                        {User !== null && <>
                            <li>
                                <NavLink to="index" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent" aria-current="page">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="About" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">About</NavLink>
                            </li>
                            <li>
                                <NavLink to="Profile" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Profile</NavLink>
                            </li>
                            <li>
                                <NavLink to="Messages" className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent">Messages</NavLink>
                            </li>
                        </>}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
