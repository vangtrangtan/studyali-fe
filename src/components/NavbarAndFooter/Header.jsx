import Navbar from './Navbar';
import React, { useState, useRef } from "react";
import { CHINESE, ENGLISH } from '../fileWithConstants';
const Header = ({language,setLanguage}) => {
  function SelectLanguage() {
    let listOption = []
    if(language===CHINESE)listOption=[...listOption,<option selected key={1} value={CHINESE}>Nihao</option>]
    else listOption=[...listOption,<option key={1} value={"cn"}>Nihao</option>]
    if(language===ENGLISH)listOption=[...listOption,<option selected key={2} value={ENGLISH}>Hello</option>]
    else listOption=[...listOption,<option key={2} value={ENGLISH}>Hello</option>]

    const handleChange = (e) => {
      setLanguage(e.target.value);
    };
    return (
           <select onChange={handleChange}>
        {listOption}
    </select>
       
    )
  }

  return (
    <header>
      <div className="nav-area">
        <a href="/" className="logo">
          Studyali
        </a>
        <div className="dropdown">
          <button className="dropbtn">{language===ENGLISH?"Hello":"Ni hao"}
            <i className="fa fa-caret-down"></i>
            <span className="arrow"/>
          </button>
          <div className="dropdown-content">
            <a href="/changelang/eng">🇬🇧 English</a>
            <a href="/changelang/cn">🇨🇳 Chinese</a>      
          </div>
          
        </div>
        <Navbar language={language}/>
      </div>
    </header>
  );
};

export default Header;