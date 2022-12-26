import React from 'react'
import { userSignOut } from '../config/firebase';
import logo from '../images/logo.png'
import '../view/home.css';

function Navbar() {

    const LogOut = () => {
        userSignOut();
    };
    return (
        <div>
            <nav class="navbar bg-dark">
                <div class="container-fluid">
                    {/* <img src={logo} alt="" style={{ width: '100px' }} /> */}
                    <form class="d-flex" role="search">
                        <button className="btn btn-danger w-100" onClick={LogOut}>SignOut</button>
                    </form>
                </div>
            </nav>

        </div>
    )
}

export default Navbar
