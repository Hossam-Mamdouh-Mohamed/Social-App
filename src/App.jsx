import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import SignUp from './components/SignUp/SignUp'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import SignIn from './components/SignIn/SignIn'
import NotFound from './components/NotFound/NotFound'
import { UserContextProvider } from './Context/UserContext'
import Index from './components/Index/Index'
import Post from './components/Post/Post'
import About from './components/About/About'
import Profile from './components/Profile/Profile'
function App() {

 let route = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <SignIn /> },
        { path: "SignUp", element: <SignUp /> },
        { path: "SignIn", element: <SignIn /> },
        { path: "About", element: <About /> },
        { path: "Profile", element: <Profile /> },
        { path: "index", element: <Index /> },
        { path: "post/:id", element: <Post /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    basename: import.meta.env.PROD ? "/Social-App" : "/",
  }
);
  return <UserContextProvider>
    <RouterProvider router={route}></RouterProvider>
  </UserContextProvider>
}

export default App
