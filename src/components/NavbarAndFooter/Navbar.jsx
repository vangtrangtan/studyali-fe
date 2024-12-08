import { menuItemsCnData,menuItemsEngData,menuItemsLogin, menuItemsLogout } from '../../menuItemsData';
import MenuItems from './MenuItems';
import useWindowDimensions from "../useWindowDimensions";
import { checkLoginManual, detectMobile, isLoginManual } from '../utils';
import {MdOutlineMenu} from 'react-icons/md'
import React, { useState, useRef, useEffect } from "react";
import { CHINESE,ENGLISH } from '../fileWithConstants';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';

export const SyncLogin =()=>{
  const signOut = useSignOut();
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();

  const history = useNavigate();
  const onStorageChange=(e)=>{
    // console.log(e);
    console.log(e.key);
    if(e.key==="_auth_"){
      // console.log("new");
      console.log(e.newValue);
      // console.log("p"+isAuthenticated);
      if(e.newValue===null){
          console.log(e);
        signOut();
        history('/home');
      }
    
    }
  }
  useEffect(() => {
    window.addEventListener('storage',onStorageChange);

    return () => {
      window.removeEventListener('storage',onStorageChange);
    };
  },[]);
}

const Navbar = ({language}) => {
  const [click, setClick] = useState(false);
  const { heightWindow, widthWindow } = useWindowDimensions();
  const [rerender,setRerender] = useState(false);
  const depthLevel = 0;
  const closeMenu = () => {setClick(false);}
  
  //check log in log out
  // console.log("ww"+isAuthenticated);
  useEffect(() => {
    const interval = setInterval(() => {
      setRerender(!rerender);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  // SyncLogin();
  
  var mymenu = (language===CHINESE?menuItemsCnData:menuItemsEngData);
  // console.log("c"+useIsAuthenticated());
  // console.log(checkLoginManual());
  if (!checkLoginManual()){
    mymenu=[...mymenu,...menuItemsLogin];
    // console.log("not login");
  }
  else{
    mymenu=[...mymenu,...menuItemsLogout];
    // console.log("login");
    
  }


  if(detectMobile()){
    
    const Hamburger = <MdOutlineMenu className="HamburgerMenu" size="30px" color="black" onClick={() => setClick(!click)}/>
    return(
        <nav className="mobile-nav">
            {Hamburger}
            {click && (
              <ul className="menus">
                {mymenu.map((menu, index) => {
                  return <MenuItems items={menu} key={index} depthLevel={depthLevel} isMobile={true} closeMenu={closeMenu} isShowingMenu={click}/>;
                })}
              </ul>
            )}
        </nav>
    )

  }
  else{
    return (
      <nav className="desktop-nav">
        <ul className="menus">
          {mymenu.map((menu, index) => {
            return <MenuItems items={menu} key={index} depthLevel={depthLevel} isMobile={false}/>;
          })}
        </ul>
      </nav>
    );
  }
  
};

export default Navbar;