// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react'
import { Navigate, Redirect, Route, useNavigate } from 'react-router-dom'
import { checkLoginManual } from './utils'

export const PrivateRoute = ({ children }) => {
    const isLoggedIn = checkLoginManual();
    const history = useNavigate();
    console.log("as");
    if (!isLoggedIn) {
      // user is not authenticated
        alert("please log in to use this feature !");
        return <Navigate to="/login" />;
    }
    return children;
  };
export default PrivateRoute