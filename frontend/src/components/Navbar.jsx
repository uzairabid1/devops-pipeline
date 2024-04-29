import React from 'react'
import LogoImage from '../assets/IntelliDevops.png'
import { useNavigate } from 'react-router-dom'


const Navbar = ({loggedInName}) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login')
    }
  return (
    

<nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
  <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="#" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img src={LogoImage} class="h-12 rounded-md" alt="Flowbite Logo"/>
      <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">IntelliDeploy</span>
  </a>
  <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
    {loggedInName ?(
        <span className="text-gray-600 dark:text-gray-300">{loggedInName}</span>
    ):(
      <button type="button" onClick={handleLoginClick} className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-md text-sm px-4 py-2 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 mr-2">Login</button>
    )} 
  </div>
  
  </div>
</nav>

  )
}

export default Navbar