import React, { useEffect, useState } from 'react';
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

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();
    const signIn = useSignIn();
    console.log(useIsAuthenticated());
    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await axios.post(SERVER+'/auth/signin', { username, password });
            console.log('Login check:', response.data);
            if(response.data.jwt!==null){
                signIn({
                    auth: {
                        token: response.data.jwt,
                        type: 'Bearer'
                    },
                    userState: {
                        name: username,
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
        <div className="d-flex justify-content-center align-items-center vh-50">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">Đăng nhập / Log in</h2>
                    <MDBInput wrapperClass='mb-4' placeholder='Username' id='username' value={username} type='text' onChange={(e) => setUsername(e.target.value)} />
                    <MDBInput wrapperClass='mb-4' placeholder='Password' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <button className="mb-4 d-block btn-primary" style={{ height:'50px',width: '100%' }} onClick={handleLogin}>Sign in</button>
                    <div className="text-center">
                        <p>you can use public account: studyali / 123 or register your own account</p>
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
    console.log(authHeader);
    const signOut = useSignOut()
    signOut();
    axios.post(SERVER+"/logout", {
        headers: {'Authorization': authHeader }
        , timeout: 5000
    })
        .then(function (response) {
            console.log(response);
            history('/home');
        })
        .catch(function (error) {
            console.log(error);
            history('/home');
        });
}


// export const SyncLogin =()=>{
//     const signOut = useSignOut();
//     const signIn = useSignIn();
//     const isAuthenticated = useIsAuthenticated();
//     let newUser=null;
//     let newToken=null;
//     const history = useNavigate();
//     const onStorageChange=(e)=>{
//       // console.log(e);
//       console.log(e.key);
//       if(e.key==="_auth_"){
//         // console.log("new");
//         console.log(e.newValue);
//         // console.log("p"+isAuthenticated);
//         if(e.newValue===null){
//             console.log(e);
//           signOut();
//           history('/about');
//         }
//         else{
//           newToken=e.newValue;
//           console.log(isAuthenticated+' '+newUser+ ' '+newToken);
//           if(newUser!==null && newToken!==null){
//             alert("aaa");
//             // if(!isAuthenticated){
//             //       signIn({auth: {
//             //         token: newToken,
//             //         type: 'Bearer'
//             //     },
//             //     userState: newUser
//             //   });
              
//               history('/about');
//             // }
//             newUser=null;
//             newToken=null;
//           }
//         }
        
//       }
//       if(e.key==="_auth__state"){
//         newUser=e.newValue;
//         console.log(isAuthenticated+' '+newUser+ ' '+newToken);
//         if(newUser!==null && newToken!==null){
//             alert("bbb");
//         //   if(!isAuthenticated){
//             // signIn({auth: {
//             //       token: newToken,
//             //       type: 'Bearer'
//             //   },
//             //   userState: newUser
//             // });
//             history('/about');
//         //   }
//           newUser=null;
//           newToken=null;
//         }
        
//       }
//     }
//     useEffect(() => {
//       window.addEventListener('storage',onStorageChange);
  
//       return () => {
//         window.removeEventListener('storage',onStorageChange);
//       };
//     },[]);
//   }

export default LoginPage;