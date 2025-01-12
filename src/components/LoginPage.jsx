import React, { useEffect, useState } from 'react';
import  { Navigate } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';

import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER } from './fileWithConstants';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { rerenderNavbar } from './NavbarAndFooter/Navbar';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { checkLoginManual } from './utils';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();
    const signIn = useSignIn();
    if(checkLoginManual()){
        return <Navigate to='/home'/>
    }
    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await axios.post(SERVER+'/auth/signin', { username, password });
            if(response.data.jwt!==null){
                signIn({
                    auth: {
                        token: response.data.jwt,
                        type: 'Bearer'
                    },
                    userState: {
                        name: username,
                        default_server: response.data.defaultServer,
                        uid: 0
                    }
                })
                history('/home');
            }
            else{
                setError(response.data.message);
            }
            
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto', marginTop:"-30%"}}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Đăng nhập / Log in</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username} type='text' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="mb-4 d-block btn-primary" style={{ height:'50px',width: '100%' }} onClick={handleLogin}>Sign in</button>
                    <div className="text-center">
                        {/* <p>you can use public account: studyali / 123 or register your own account</p> */}
                        <p>Not a member? <a href="/signup" >Đăng ký / Register</a></p>
                    </div>
                </MDBContainer>
            </div>
        </div>
    );
}

export function LogoutPage(){
    const history = useNavigate();
    const authHeader = useAuthHeader();
    const signOut = useSignOut()
    signOut();
    axios.post(SERVER+"/logout", {
        headers: {'Authorization': authHeader }
        , timeout: 5000
    })
        .then(function (response) {
            history('/home');
        })
        .catch(function (error) {
            history('/home');
        });
}

export default LoginPage;