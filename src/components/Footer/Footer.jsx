import React, { useEffect, useState } from 'react'
import Styles from './Footer.module.css'

export default function Footer() {

    return <footer className="bg-black text-white text-center py-3 mt-auto">
        <div className="container">
            <p className="mb-0">
                © {new Date().getFullYear()} My React App. All rights reserved.
            </p>
        </div>
    </footer>
}
