import {BrowserRouter,Route, Routes, useNavigate, Redirect} from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import createStore from 'react-auth-kit/createStore';
import Header from './components/NavbarAndFooter/Header';
import Footer from './components/NavbarAndFooter/Footer';
// styles

import './App.css';
import useToken from './components/UseToken';
import GameWordOrderCn from './components/Sentence/WordOrderCn';
import GameWordOrderEng from './components/Sentence/WordOrderEng';
import GameVocaCn from './components/Vocabulary/GameVocaCn';
import GameVocaEng from './components/Vocabulary/GameVocaEng';
import { CHINESE, ENGLISH } from './components/fileWithConstants';
import PreventPullToRefresh from './components/preventRefresh';
import About from './components/About';

import LoginPage, { LogoutPage, SyncLogin } from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import AuthProvider from 'react-auth-kit';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import Home from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
function disableDevtool() {
   // Disable right-click
   document.addEventListener("contextmenu", (e) => e.preventDefault());
 
   function ctrlShiftKey(e, key) {
     return e.ctrlKey && e.shiftKey && e.key === key;
   }
 
   document.addEventListener("keydown", (e) => {
     // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
     console.log(e);

     if (
       e.key === "F12" ||
       ctrlShiftKey(e, "I") ||
       ctrlShiftKey(e, "J") ||
       (e.ctrlKey && e.key === "U")
     ) {
       e.preventDefault();
     }
   });
 }
 
const App = () => {
   const [language, setLanguage] = useState(ENGLISH);
   const UpdateLanguageCn = () => {
      
      useEffect(() => {
         setLanguage(CHINESE);
       }, []);
      return <Home/>;
   }
   const UpdateLanguageEng = () => {   
      useEffect(() => {
         setLanguage(ENGLISH);
       }, []);     
       return <Home/>;
   }

   console.log("lang"+language);

   disableDevtool();

    return<BrowserRouter>
            <div><Header language={language} setLanguage={setLanguage}/>
            <div className='main-body'>
            
               <Routes>
                  <Route path="/chinese/vocabulary" element={<PrivateRoute><GameVocaCn/></PrivateRoute> } />
                  <Route path="/chinese/wordorder" element={<PrivateRoute><GameWordOrderCn/></PrivateRoute>} />
                  <Route path="/english/vocabulary" element={<PrivateRoute><GameVocaEng/></PrivateRoute>} />
                  <Route path="/english/wordorder" element={<PrivateRoute><GameWordOrderEng/></PrivateRoute>} />
                  <Route path="/changelang/cn" element={<UpdateLanguageCn/>}/>
                  <Route path="/changelang/eng" element={<UpdateLanguageEng/>}/>
                  <Route path="/signup" element={<SignupPage/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/logout" element={<LogoutPage/>}/>
                  <Route path="/about" element={<About/>}/>
                  <Route path="/home" element={<Home/>}/>
                  <Route path="/" element={<Home/>}/>
               </Routes>
               
               <Footer />
            </div>
            </div>
         </BrowserRouter>
         
   //  </PreventPullToRefresh>;
};
  
export default App;