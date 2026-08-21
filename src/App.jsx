import SignUp from './components/SignUp/SignUp'
import Home from './components/Home/Home'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import SignIn from './components/SignIn/SignIn'
import NotFound from './components/NotFound/NotFound'
import { UserContextProvider } from './Context/UserContext'
import Post from './components/Posts/Post/Post'
import About from './components/About/About'
import Profile from './components/Profile/Profile'
import Auth from './Auth/Auth'
import UserProfile from './components/UserProfile/UserProfile'
import Create from './components/Posts/Create/Create'
import Edit from './components/Posts/Edit/Edit'

function App() {

  let route = createBrowserRouter(
    [
      {
        path: "/",element: <Layout />,children: [
          { index: true, element: <SignIn /> },
          { path: "SignUp", element: <SignUp /> },
          { path: "SignIn", element: <SignIn /> },
          { path: "About", element: <Auth><About /></Auth> },
          { path: "Profile", element: <Auth><Profile /></Auth> },
          { path: "UserProfile/:id", element: <Auth><UserProfile /></Auth> },
          { path: "Home", element:  <Auth><Home /></Auth> },
          { path: "post/create", element: <Auth><Create /></Auth> },
          { path: "post/edit/:id", element: <Auth><Edit /></Auth> },
          { path: "post/:id", element:  <Auth><Post /></Auth> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
    {
      basename: import.meta.env.PROD ? "/Social-App/" : "/",
    }

  );

  return <UserContextProvider>
    <RouterProvider router={route}></RouterProvider>
  </UserContextProvider>
}

export default App
