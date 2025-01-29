import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import '../../App.css';
import "../../css/exercise.css";
import ConfirmationDialog from "../Confirm/ConfirmationDialog";
import { ENGLISH, SERVER } from "../fileWithConstants";

function ShowResult({ question }) {
    function ShowOptionchoice() {

        return <ul style={{ listStyleType: 'none' }}>
            {question.options.map((c, idx) => {
                var color = "grey";
                if (c.id === question.correctOptionId) color = "green";

                return (
                    <li key={c.id}>
                        <div className="optionchoice">
                            <button className="optionchoicebutton" style={{ pointerEvents: "none", backgroundColor: color }}>{String.fromCharCode('A'.charCodeAt(0) + idx)}</button>
                            <p className="optionvalue">{c.value}</p>
                        </div>

                    </li>
                )
            })}
        </ul>
    }

    return (
        <div>
            <div style={{ height: "20px" }}></div>
            <div className="statement">{question.statement}</div>
            <div><ShowOptionchoice /></div>
            {(question.explain!=null && question.explain.length>0)&&<div className="statement" style={{fontSize: "medium"}}>Explain: {question.explain}</div>}
        </div>);
}


export function Exercise({ question }) {
    const navigate = useNavigate();
    const authHeader = useAuthHeader();
    function Body() {

        return <ShowResult question={question} />;
    }

    function handleEdit() {
        navigate('/exercise/edit',{state:question});
    }

    function handleDelete(){
        sendDeleteExercise({id:question.id, auth: authHeader});
        navigate('/gym/own');
    }
    function Header() {
        return <div style={{ textAlign: "center" }}>
            <p className="text h4 mb-3 mt-2"><strong>{question.name}</strong></p>
            <p className="text mb-0">Time Limit: {question.timeLimit > 0 ? question.timeLimit + " second(s)" : "None"}</p>
            <p className="text mb-0">Author: {question.authorName}</p>
        </div>
    }
  
    return <div className='exercise'>
        <Header />
        <div style={{ marginTop: "50px" }}>
            <Body />
        </div>

        <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} >
            <button type="button" className="btn btn-secondary btn-rounded col-2" data-mdb-ripple-init onClick={handleEdit}>Edit</button>            
             <ConfirmationDialog response={handleDelete} >
              {(showDialog) => (
                <button type="button" className="btn btn-danger btn-rounded col-2 ms-3" data-mdb-ripple-init onClick={showDialog}>Delete</button>
              )}
            </ConfirmationDialog>
        </div>
    </div>
}


function sendDeleteExercise(props) {
    
    const handleResquest = async () => {
        try {
            const response = await axios.delete(SERVER + '/api/exercise/delete/'+props.id,
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': props.auth }
                }
            );

            if (response.data.status === false) {
                alert(response.data.message);
            }
            else {
                // history('/login');
            }
        } catch (error) {
            // Handle signup error
            console.error('sendDeleteExercise failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}


const sendGetOwnExercise = async (exId, setExercise, authHeader, nav) => {
    const URLGetQuestion = SERVER + '/api/exercise/get';
    const res = await axios.get(URLGetQuestion, {
        params: {
            id: exId,
            own: true,
        },
        headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': authHeader }
        , timeout: 5000
    })
        .then(function (response) {
            if (response.data === null || response.data.length === 0) {
                nav("/home");
            }
            setExercise(response.data);
        })
        .catch(function (error) {
            console.log(error);
            alert("Error get question !!! please contact ADMIN");
        });
}
export default function LoadOwnExercise() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [exercise, setExercise] = useState(null);
    var exId = searchParams.get("id");
    const authHeader = useAuthHeader();
    const nav = useNavigate();
    var ques = {
        statement: "whata a as a awhata a as a awhata a as a awhata a as a awhata a as a awhata a as a awhata a as a a",
        correctOptionId: 1,
        timeLimit: 5,
        name: "wtf ",
        authorName: "me",
        language: ENGLISH,
        id:12,
        options: [
            {
                id: 1,
                value: "whata a as a awhata "
            },
            {
                id: 2,
                value: "hehe1"
            },
            {
                id: 3,
                value: "hehe1"
            },
            {
                id: 4,
                value: "hehe1"
            }

        ]
    }
    if (exercise === null) {
        if ((/[0-9\b]+$/.test(exId))) {
            sendGetOwnExercise(exId, setExercise, authHeader, nav);
        // setExercise(ques);
        }
        else {
            return <div className='loading'>Error !!! </div>;
        }
        return <div className='loading'>Loading ... </div>;
    }



    return <Exercise question={exercise} />
}