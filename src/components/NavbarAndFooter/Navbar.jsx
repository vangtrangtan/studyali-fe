import React, { useEffect, useState } from "react";
import { MdOutlineMenu } from 'react-icons/md';
import { menuItemsCnData, menuItemsEngData, menuItemsLogin, menuItemsLogout } from '../../menuItemsData';
import { CHINESE } from '../fileWithConstants';
import useWindowDimensions from "../useWindowDimensions";
import { checkLoginManual, detectMobile } from '../utils';
import MenuItems from './MenuItems';



const Navbar = ({language}) => {
  const [click, setClick] = useState(false);
  const { heightWindow, widthWindow } = useWindowDimensions();
  const [rerender,setRerender] = useState(false);
  const depthLevel = 0;
  const closeMenu = () => {setClick(false);}
  
  //check log in log out
  useEffect(() => {
    const interval = setInterval(() => {
      setRerender(!rerender);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });

  
  var mymenu = (language===CHINESE?menuItemsCnData:menuItemsEngData);

  if (!checkLoginManual()){
    mymenu=[...mymenu,{
      title: 'Gym',
      url: (language===CHINESE?'/chinese':'/english')+'/gym/public'
    },...menuItemsLogin];
  }
  else{
    mymenu=[...mymenu,{
      title: 'Gym',
      url: '/gym'
    },...menuItemsLogout];    
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