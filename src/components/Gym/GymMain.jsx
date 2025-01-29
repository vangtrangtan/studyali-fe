import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import "../../css/gymMain.css";
import { SERVER } from '../fileWithConstants';

import { MDBContainer, MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';
import { detectMobile, getLangFromLocalStorage } from '../utils';
import Create from './ExerciseOperate';
import { GymNavBar } from './NavBar';

// export function GymMain({ lang }) {
const sendGetExerciseList = async (language, pageId, size, setExerciseList, authHeader, owner) => {
  const URLGetQuestion = SERVER + '/api/exercise/getlist' + (owner ? "/own" : "");
  const res = await axios.get(URLGetQuestion, {
    params: {
      language: language,
      pageId: pageId,
      size: size
    },
    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': authHeader }
    , timeout: 5000
  })
    .then(function (response) {
      setExerciseList(response.data);
    })
    .catch(function (error) {
      console.log("sendGetExerciseList gymain = " + error);
      alert("Error get question !!! please contact ADMIN");
    });
}

function ShowExerciseList({ owner = false }) {
  const [exerciseList, setExerciseList] = useState(null);
  const authHeader = useAuthHeader();
  const [currentPage, setCurrentPage] = useState(1);
  const language = getLangFromLocalStorage();
  var lastPage = 1;
  const numExercisePerPage = 10;
  var from = (currentPage - 1) * numExercisePerPage;
  if (exerciseList === null) {
    sendGetExerciseList(language, currentPage - 1, numExercisePerPage, setExerciseList, authHeader, owner);

    return <div className='loading'>Loading ... </div>;
  }
  else {
    if (exerciseList.length === numExercisePerPage) {
      lastPage = currentPage + 1;
    }
    else {
      lastPage = currentPage;
    }
    return (
      <>
        <table className="table exercise-table" style={{ backgroundColor: "#f3e7d1b7" }}>
          <thead>
            <tr>
              <th width="10%" scope="col">#</th>
              <th scope="col">name</th>
              <th width={detectMobile() ? "30%" : "15%"} scope="col">author</th>
            </tr>
          </thead>
          <tbody>
            {
              exerciseList.map((e, idx) => <tr key={idx}>
                <th scope="row">{from + idx + 1}</th>
                <td><a href={(owner === true ? "/own" : "") + `/exercise?id=${e.id}`} style={{ color: "mediumblue" }}>{e.name}</a></td>
                <td>{e.authorName}</td>
              </tr>)
            }
          </tbody>
        </table>
        <Paging currentPage={currentPage} setCurrentPage={setCurrentPage} lastPage={lastPage} setExerciseList={setExerciseList} />
      </>
    )
  }
}


export function Paging({ currentPage, setCurrentPage, lastPage, setExerciseList }) {

  function movePrev() {
    setCurrentPage(currentPage - 1);
    setExerciseList(null);
  }
  function moveNext() {
    setCurrentPage(currentPage + 1);
    setExerciseList(null);
  }
  function movePage(numPage) {
    setCurrentPage(numPage);
    setExerciseList(null);
  }

  return (
    <MDBPagination center className='mb-0' >
      <MDBPaginationItem disabled={currentPage === 1}>
        <MDBPaginationLink style={{ backgroundColor: "#f3e7d1b7", cursor: "pointer" }} onClick={movePrev}>
          Prev
        </MDBPaginationLink>
      </MDBPaginationItem>
      {currentPage > 1 &&
        <MDBPaginationItem>
          <MDBPaginationLink style={{ backgroundColor: "#f3e7d1b7", cursor: "pointer" }} onClick={e => movePage(currentPage - 1)}>{currentPage - 1}</MDBPaginationLink>
        </MDBPaginationItem>
      }
      <MDBPaginationItem active aria-current='page'>
        <MDBPaginationLink style={{ backgroundColor: "#d2f5c9", color: 'black' }}>
          {currentPage} <span className='visually-hidden'>(current)</span>
        </MDBPaginationLink>
      </MDBPaginationItem>
      {currentPage < lastPage &&
        <MDBPaginationItem>
          <MDBPaginationLink style={{ backgroundColor: "#f3e7d1b7", cursor: "pointer" }} onClick={e => movePage(currentPage + 1)}>{currentPage + 1}</MDBPaginationLink>
        </MDBPaginationItem>
      }
      <MDBPaginationItem disabled={currentPage === lastPage}>
        <MDBPaginationLink style={{ backgroundColor: "#f3e7d1b7", cursor: "pointer" }} onClick={moveNext}>Next</MDBPaginationLink>
      </MDBPaginationItem>
    </MDBPagination>
  );
}


export function GymMain() {
  
  return (
    <section>
      <MDBContainer className="py-1 gymMainWrap" style={{ height: "100%" }}>
        <GymNavBar />
        {window.location.pathname === "/gym" && <ShowExerciseList />}
        {window.location.pathname === "/gym/own" && <ShowExerciseList owner={true} />}
        {window.location.pathname === "/gym/create" && <Create />}

      </MDBContainer>
    </section>
  )
  
  // return (
  //   <table class="table">
  //     <thead>
  //       <tr>
  //         <th scope="col">#</th>
  //         <th scope="col">name</th>
  //         <th scope="col">difficulty</th>
  //         <th scope="col">author</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       <tr>
  //         <th scope="row">1</th>
  //         <td>Mark</td>
  //         <td>starter</td>
  //         <td>@mdo</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">2</th>
  //         <td>Jacob</td>
  //         <td>Thornton</td>
  //         <td>@fat</td>
  //       </tr>
  //       <tr>
  //         <th scope="row">3</th>
  //         <td colspan="2">Larry the Bird</td>
  //         <td>@twitter</td>
  //       </tr>
  //     </tbody>
  //   </table>
  // )
}