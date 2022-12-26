import { useEffect, useState } from 'react'
import {
    createBrowserRouter,
    RouterProvider,
    createRoutesFromElements,
    Route,
    Navigate
} from "react-router-dom"

import { auth, onAuthStateChanged } from '../firebase'

import Login from "../../view/LoginPage"
import Company from "../../view/CompanyPage"
import Home from "../../view/Home"
import UserPage from "../../view/UserPage"

export default function Router() {
    const [user, setUser] = useState(false)
    

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                setUser(true);
                // ...
            } else {
                setUser(false)
                // User is signed out
                // ...
            }
        });
    }, [])



    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path="/" element={
                    <ProtectedRoute
                        user={user}
                        route={<Home />}
                        navigateTo='/login' />}
                />
                <Route path="/login" element={
                    <ProtectedRoute
                        user={!user}
                        route={<Login />}
                        navigateTo='/' />}
                />
                <Route path="/company" element={
                    <ProtectedRoute
                        user={user}
                        route={<Company />}
                        navigateTo='/login' />}
                />
                <Route path="/user" element={
                    <ProtectedRoute
                        user={user}
                        route={<UserPage />}
                        navigateTo='/login' />}
                />
            </>
        )
    )


    return <RouterProvider router={router} />
}

function ProtectedRoute({ user, route, navigateTo }) {
    return user ? route : <Navigate to={navigateTo} replace={true} />
}
