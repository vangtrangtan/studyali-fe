import Navbar from './Navbar';
import React, { useState, useRef, useContext } from "react";
import { CHINESE, ENGLISH } from '../fileWithConstants';
import { getLangFromLocalStorage, saveLangToLocalStorage } from '../utils';
import { useNavigate } from 'react-router-dom';
// const Header = ({language,setLanguage}) => {
const Header = ({language, setLanguage}) => {
  const navigate = useNavigate();
  function changeLang(l){
    if(l!==language){
      saveLangToLocalStorage(l);
      setLanguage(l);
      navigate("/home");
    }
  }
  console.log("qw");
  return (
    <header>
      <div className="nav-area">
        <a href="/" className="logo">
          Studyali
        </a>
        <div className="dropdown">
          <button className="dropbtn" >{language === ENGLISH ? "Hello" : "Ni hao"}
            <i className="fa fa-caret-down"></i>
            <span className="arrow" />
          </button>
          <div className="dropdown-content">
            <a style={{cursor: "pointer"}} onClick={() => changeLang(ENGLISH)}>🇬🇧 English</a>
            <a style={{cursor: "pointer"}} onClick={() => changeLang(CHINESE)}>🇨🇳 Chinese</a>
            {/* <a href="/changelang/eng">🇬🇧 English</a>
            <a href="/changelang/cn">🇨🇳 Chinese</a>       */}
          </div>

        </div>
        <Navbar language={language} />
      </div>
    </header>
  );
};

export default Header;