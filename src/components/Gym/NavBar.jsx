import { MDBCollapse, MDBContainer, MDBIcon, MDBNavbar, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler, MDBRow } from "mdb-react-ui-kit";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export function GymNavBar(){
    const [openNavSecond, setOpenNavSecond] = useState(false);
    // const [curTab, setCurTab] = useState("main"); //main / create/
    return (
        <MDBRow className='mb-3'>
        <MDBNavbar expand='lg' style={{backgroundColor:"#f3e7d1b7"}}>
            <MDBContainer fluid>
            <MDBNavbarToggler
                
                aria-expanded='false'
                aria-label='Toggle navigation'
                onClick={() => setOpenNavSecond(!openNavSecond)}
            >
                <MDBIcon icon='bars' fas>+</MDBIcon>
            </MDBNavbarToggler>
            <MDBCollapse navbar open={openNavSecond} >
                <MDBNavbarNav >
                <MDBNavbarLink className='barchoice' active={window.location.pathname==="/gym"} href="/gym" aria-current='page'>
                    Main
                </MDBNavbarLink>
                <MDBNavbarLink className='barchoice' active={window.location.pathname==="/gym/own"}  href="/gym/own" aria-current='page' style={{minWidth:"100px"}}>
                    My Exercise
                </MDBNavbarLink>
                <MDBNavbarLink className='barchoice' active={window.location.pathname==="/gym/create"}  href="/gym/create" aria-current='page'>
                    Create
                </MDBNavbarLink>
                
                </MDBNavbarNav>
            </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
        </MDBRow>
      );
}