import React from 'react';
import '../../App.css';
const Footer = () => {
    const year = new Date().getFullYear();

    // return <footer>{`Studyali © my personal website for study 🇻🇳, ${year}`}</footer>;
    return <footer>{`my personal website for study 🇻🇳, studyali, ${year}`}</footer>;
}
export default Footer;