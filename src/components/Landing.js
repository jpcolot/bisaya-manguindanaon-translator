import React from 'react'
import "./Landing.css"
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className='Landing'>
            <div className='Landing__left'>
                <h1>  Bisaya to Maguindanaon Language Translator</h1>
                {/* <h1>Professional translation scaled by technology and <br /> enhanced by human experts</h1>
                <h4>A system that will translate the basic Maguindanaon words into Bisaya words.</h4> */}

                <Link to="/view"> <button className='Landing__button'> Get started </button></Link>
            </div>
            <div className='Landing__right'></div>

        </div>
    )
}

export default Landing