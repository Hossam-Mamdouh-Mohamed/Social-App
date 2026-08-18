import React, { useEffect, useState } from 'react'
import Styles from './NotFound.module.css'

export default function NotFound() {

    const [counter,setcounter]=useState(0);
    useEffect(() => {}, [])

    return <>

        <h2>NotFound</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, officiis.</p>
    </>
}
