import { useEffect, useMemo, useState } from "react";
import '../../App.css';
import "../../css/exercise.css"
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVER } from "../fileWithConstants";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function ShowResult({ question, userAnswer }) {
    function ShowOptionchoice() {

        return <ul style={{ listStyleType: 'none' }}>
            {question.options.map((c, idx) => {
                var color = "grey";
                if (c.id === question.correctOptionId) color = "green";
                else if (c.id === userAnswer) color = "red";

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
            {(question.explain != null && question.explain.length > 0) && <div className="statement" style={{ fontSize: "medium" }}>Explain: {question.explain}</div>}
        </div>);
}

function sendResult(auth, question_id, result) {
    const handleResquest = async () => {
        try {
            console.log("sened"+SERVER);
            const response = await axios.post(SERVER + `/api/exercise/saveresult/${question_id}`, {
                result
            },
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': auth }
                }
            );
        } catch (error) {
            console.error('sendResult failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}

function HandleQuestion({ auth, uid, gameId, setAnswer, question, sendResToServer }) {

    /*
    question{
        statement: text
        options:[
            {
                id
                value
            }
        ]
        correctOptionId
        timeLimit    
    }
    */

    const [countDown, setCountDown] = useState(question.timeLimit > 0 ? question.timeLimit : null);

    function showOptionchoice() {
        // disable hover pointerEvents:"none"
        return <ul style={{ listStyleType: 'none' }}>
            {question.options.map((c, idx) => (
                <li key={c.id}>
                    <div className="optionchoice">
                        <button className="optionchoicebutton" onClick={() => saveAnswer(c.id)}>{String.fromCharCode('A'.charCodeAt(0) + idx)}</button>
                        <p className="optionvalue">{c.value}</p>
                    </div>

                </li>
            ))}
        </ul>
    }
    //to avoid re-render when time count
    const optionChoiceMemo = useMemo(() => showOptionchoice(), [question]);
    function saveAnswer(optionId) {
        setAnswer(optionId);
        let res = "no_answer";
        if (optionId != -1) {
            if (optionId === question.correctOptionId) res = "correct";
            else res = "wrong";
        }
        if(sendResToServer===true)sendResult(auth, question.id, res);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (countDown == null) {
                // do not count down
            }
            else {
                if (countDown === 1) {
                    saveAnswer(-1);
                }
                else {
                    setCountDown(xx => xx - 1);
                }
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [countDown]);

    function CountDownDiv() {
        if (countDown == null) return <div style={{ height: "20px" }}></div>
        else return <div style={{ height: "20px", textAlign: "center", fontSize: "large" }}> ⏰ {countDown}s</div>
    }

    return (
        <div>
            <CountDownDiv />
            <div className="statement">{question.statement}</div>
            <div>{optionChoiceMemo}</div>
        </div>);
}


export function Exercise({ question, sendResToServer }) {
    const [answer, setAnswer] = useState(null);
    const [start, setStart] = useState(question.timeLimit > 0 ? false : true);
    const authHeader = useAuthHeader();

    function Body() {
        if (start === false) {
            return (<div style={{ marginTop: "5%", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }} >
                <button className="generalbutton" style={{ width: "20%", height: "50px", marginTop: "1%" }} onClick={() => setStart(true)}>START</button>
            </div>);
        }
        else {
            if (answer == null) {
                return <HandleQuestion question={question} sendResToServer={sendResToServer} setAnswer={setAnswer} auth={authHeader}/>;
            }
            else {
                return <ShowResult question={question} userAnswer={answer} />;
            }
        }
    }

    function Header() {
        return <div style={{ textAlign: "center" }}>
            {/* <h3>{question.name}</h3>
            <p>Time Limit: {question.timeLimit > 0 ? question.timeLimit + " second(s)" : "None"}</p>
            <p>Author: {question.authorName}</p> */}
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
    </div>
}

const sendGetExercise = async (exId, setExercise, authHeader, nav) => {
    const URLGetQuestion = SERVER + '/api/exercise/get';
    const res = await axios.get(URLGetQuestion, {
        params: {
            id: exId
        },
        headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': authHeader }
        , timeout: 5000
    })
        .then(function (response) {
            console.log(response);
            if (response.data == null || response.data.length === 0) {
                nav("/home");
            }
            setExercise(response.data);
        })
        .catch(function (error) {
            console.log(error);

            alert("Error get question !!! please contact ADMIN");

        });
}

export default function LoadExercise() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [exercise, setExercise] = useState(null);
    var exId = searchParams.get("id");
    const nav = useNavigate();
    const authHeader = useAuthHeader();
    var ques = {
        statement: "whata a as a awhata a as a awhata a as a awhata a as a awhata a as a awhata a as a awhata a as a a",
        correctOptionId: 1,
        timeLimit: 5,
        name: "wtf ",
        authorName: "me",
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

    if (exercise == null) {
        if ((/[0-9\b]+$/.test(exId))) {
            sendGetExercise(exId, setExercise, authHeader, nav);
            // setExercise(ques);
        }
        else {
            return <div className='loading'>Error !!! </div>;
        }
        return <div className='loading'>Loading ... </div>;
    }



    return <Exercise question={exercise} sendResToServer={true} />
}