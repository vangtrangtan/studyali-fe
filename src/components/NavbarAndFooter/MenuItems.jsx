import Dropdown from './Dropdown';
import { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom';

const MenuItems = ({ items, depthLevel, isMobile, closeMenu,isShowingMenu }) => {
    
    const [dropdown, setDropdown] = useState(false);
    let ref = useRef();

    useEffect(() => {
        const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
          setDropdown(false);
         }
        //  console.log(ref.current.className);
        // console.log("www");
        //  console.log(event.target.className);
        //  console.log(event.target);
         if(isMobile && isShowingMenu && (event.target.href===undefined && event.target.className!==undefined  && event.target.className.animVal!=="HamburgerMenu")){
            closeMenu();
         }
        };
   
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
         // Cleanup the event listener
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
     
        };
       }, [isShowingMenu]);

    const onClick = () => {
        setDropdown(false);
        if(isMobile && isShowingMenu)closeMenu();
        console.log("here");
    };
    return (
        <li className="menu-items" ref={ref} onClick={onClick}>
         {items.submenu ? (
          <>
           <button
            
            type="button" 
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
           >
            {items.title}{" "}{depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
           </button>
           <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown} 
           />
          </>
         ) : (
            <NavLink  to={items.url} className="navlink">{items.title}</NavLink>
         )}
        </li>
       );
};

export default MenuItems;