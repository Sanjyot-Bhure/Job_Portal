// import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from '@/components/ui/shared/Navbar'
import './App.css'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/auth/Home'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
])
function App() {

  return (
    <>
      {/* <RouterProvider router= {appRouter }/> */}
      <Navbar/>
    </>
  )
}

export default App
