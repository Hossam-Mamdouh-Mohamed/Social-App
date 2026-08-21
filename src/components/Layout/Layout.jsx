import React, { useEffect, useState } from 'react'
import Styles from './Layout.module.css'
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'

export default function Layout() {

    const [counter,setcounter]=useState(0);
    useEffect(() => {}, [])

        return <div className={Styles.Layout}>
        <Navbar />
        <main className={Styles.main}>
            <Outlet />
        </main>
        <Footer />
        </div>
}
