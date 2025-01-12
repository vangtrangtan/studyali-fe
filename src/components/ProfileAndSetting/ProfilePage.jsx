import React, { useState } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBNavbar,
  MDBNavbarToggler,
  MDBIcon,
  MDBCollapse,
  MDBNavbarNav,
  MDBNavbarLink,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../App.css"
import "../../css/profile.css"
import AVATAR_IMG from '../../avatarcommon.png';
import PieChartLegendDemo from './LevelPieChart';
import { CHINESE, ENGLISH, SERVER } from '../fileWithConstants';
import PieChartComponent from './LevelPieChart';
import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { pie } from 'd3';
import { detectMobile } from '../utils';
import SettingPage from './SettingPage';

function sendProfileRequest(username, setProfileData) {
  const handleResquest = async () => {
    try {
      const response = await axios.get(SERVER + '/profile',
        {
          params: {
            username: username,
          },
          headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json" }
          , timeout: 3000
        }
      );
      setProfileData(response.data);
    } catch (error) {
      console.error('sendProfileRequest failed:', error.response ? error.response.data : error.message);
    }
  };
  handleResquest();
}

export function StatsPage({profileData}) {
  const authHeader = useAuthHeader();
  const authUser = useAuthUser();
  const [lang, setLang] = useState(ENGLISH);
  
  function changeLang(l) {
    if (l !== lang) {
      setLang(l);
    }
  }
  let isMobile = detectMobile();

  let pieChart = (<p className="text-muted mb-5">unvailable stats</p>);
  let totalScore = "N/A";
  let rank ="N/A";
  let username=authUser.name;
  let fullName = "N/A";
  let solvedExcercise = "N/A";
  let correctRate ="N/A"; 
  let slogan ="N/A";
  if(profileData === null){
    
  }
  else{
    if(lang===ENGLISH && (profileData.engStatsBylevel!==null && profileData.engStatsBylevel.length>0)){
      pieChart =(<PieChartComponent data={profileData.engStatsBylevel}/>);
    }
    if(lang===CHINESE && (profileData.cnStatsBylevel!==null && profileData.cnStatsBylevel.length>0)){
      pieChart =(<PieChartComponent data={profileData.cnStatsBylevel}/>);
    }
    totalScore = profileData.profileEntity.totalScore;
    rank = profileData.profileEntity.rank;
    fullName = profileData.profileEntity.fullName;
    slogan = profileData.profileEntity.slogan;
    solvedExcercise = (lang==ENGLISH?profileData.engStats.correctExercise:profileData.cnStats.correctExercise);
    correctRate = (lang==ENGLISH?profileData.engStats.correctRate:profileData.cnStats.correctRate)+"%";
  }

  return (
    <MDBRow>
  <MDBCol lg="4" >
  <MDBCard className="mb-4 border border-2 border-secondary rounded profilediv">
    <MDBCardBody className="text-center">
      <MDBCardImage
        src={AVATAR_IMG}
        alt="avatar"
        className="rounded-circle"
        style={{ width: '150px' }}
        fluid />
      <p className="text-muted h4"><strong>{username}</strong></p>
      <p className="text-muted mb-1">{fullName}</p>
      <p className="text-muted mb-1">Total score: {totalScore}</p>
      <p className="text-muted mb-4">Rank: {rank}</p>
      <p className="text-muted mb-5">{slogan}</p>
      <div className="d-flex justify-content-center mb-2">
      </div>
    </MDBCardBody>
  </MDBCard>

  </MDBCol>
  <MDBCol lg="8">
  <MDBCard className="mb-4 mb-md-0 border border-2 border-secondary rounded statsdiv">
        <MDBCardBody>
          <MDBRow >
            <div className="dropdown">
              <button className="dropbtn" >{lang === ENGLISH ? "English" : "Chinese"}
                <i className="fa fa-caret-down"></i>
                <span className="arrow" />
              </button>
              <div className="dropdown-content">
                <a onClick={() => changeLang(ENGLISH)}>🇬🇧 English</a>
                <a onClick={() => changeLang(CHINESE)}>🇨🇳 Chinese</a>
              </div>

            </div>
          </MDBRow>
          <MDBRow>
            <MDBCardText className="mb-2"> Solved Exercises: {solvedExcercise}</MDBCardText>
            <MDBCardText className="mb-2"> Correct rate: {correctRate}</MDBCardText>
            <>{pieChart}</>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
  </MDBCol>
  </MDBRow>
  )

}

export default function ProfilePage() {
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [curTab, setCurTab] = useState("profile"); //profile / setting
  const [profileData, setProfileData] = useState(null);
  const authHeader = useAuthHeader();
  const authUser = useAuthUser();
  if(profileData === null){
    sendProfileRequest(authUser.name, setProfileData);
  }

  function switchTab(tab) {
    if (curTab !== tab) {
      setCurTab(tab);
    }
  }

  return (
    <section>
      <MDBContainer className="py-1 profileWrap" style={{height:"100%"}}>
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
            <MDBCollapse navbar open={openNavSecond}>
              <MDBNavbarNav>
                <MDBNavbarLink className='barchoice' active={curTab==="profile"} onClick={() => switchTab("profile")} aria-current='page'>
                  Profile
                </MDBNavbarLink>
                <MDBNavbarLink className='barchoice' active={curTab==="setting"}  onClick={() => switchTab("setting")} aria-current='page'>
                  Setting
                </MDBNavbarLink>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
        </MDBRow>
        {curTab==="profile"?<StatsPage profileData={profileData}/>:<SettingPage profileData={profileData} setProfileData={setProfileData}/>}
      </MDBContainer>
    </section>
  );
}