import React, { useEffect, useState } from 'react'
import Styles from './About.module.css'

export default function About() {

    const [counter,setcounter]=useState(0);
    useEffect(() => {}, [])

    return <>

        <h2>About</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, officiis.</p>
    </>
}
