import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import useWindowDimensions from "../useWindowDimensions";
import { CHINESE, ENGLISH, SERVER } from "../fileWithConstants";
import '../../App.css';
import { detectMobile } from '../utils'; 
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

function HandleQuestion({ auth, uid, gameId, question, setAnswers, setCurrentQuestion }) {

    const [countDown, setCountDown] = useState(5);
    const [showCandidate, setShowCandidate] = useState(false);
    function showOptionchoice() {
        return <ul style={{ listStyleType: 'none' }}>
            {question.candidates.map((c) => (
                <li key={c.id}>
                    <button className="optionchoicebutton" onClick={() => saveAnswer(c.id, c.value)}>{c.value}</button>
                </li>
            ))}
        </ul>
    }
    const optionChoice = useMemo(() => showOptionchoice(), [showCandidate]);

    function saveAnswer(canId, canValue) {
        setAnswers(prevState => [...prevState, { wordId: question.wordId, userChoiceId: canId, userChoiceValue: canValue }]);
        setCurrentQuestion(prevState => prevState + 1);
        setCountDown(5);
        setShowCandidate(false);
        let res = "no_answer";
        if (canId != -1) {
            if (canId === question.wordId) res = "correct";
            else res = "wrong";
        }
        sendResult(auth, uid, gameId, question.questionId, res);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (countDown === 1) {
                if (showCandidate === true) {
                    saveAnswer(-1, '');
                }
                else {
                    setShowCandidate(true);
                    setCountDown(5);
                }
            }
            setCountDown(xx => xx - 1);

        }, 1000);
        return () => clearInterval(intervalId);
    }, [countDown]);



    return (
        <div className='showquestion'>
            <div style={{ fontSize: '80px' }}>{question.word}</div>
            <div> ⏰ {countDown}s</div>
            <div className='optionchoice'>{(showCandidate ? optionChoice : null)}</div>
        </div>);
}

function sendResult(auth, uid, game_id, question_id, result) {
    const handleResquest = async () => {
        try {
            const response = await axios.post(SERVER + '/score/submit', {
                uid,
                game_id,
                question_id,
                result,
            },
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': auth }
                }
            );
        } catch (error) {
            // Handle signup error
            console.error('sendResult failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}

function LoadResult({ answers, listQuestion }) {
    let correctCnt = 0;
    answers.map(a => {
        if (a.wordId === a.userChoiceId) correctCnt = correctCnt + 1;
    })

    return (<>
        <div className='summary-result'> Correct: {correctCnt}/{answers.length} questions</div>
        <ol className='detail-result'>
            {
                answers.map((a, idx) => (<li key={idx}>
                    <div className="myrow">
                        <div className='block_1' style={{ color: (a.wordId === a.userChoiceId) ? "LimeGreen" : "red" }}>{listQuestion[idx].word}:</div>
                        {
                            a.userChoiceId === -1 ? <div className='block_1'>No Answer</div> : (a.wordId !== a.userChoiceId && <div className='block_line'>{a.userChoiceValue}</div>)
                        }
                        <div className='block_1'>{listQuestion[idx].meaning}</div>
                    </div>
                </li>))
            }
        </ol>
    </>);
}



export default function GameVocaCn() {
    const language = ENGLISH; // eng or cn
    const URLGetQuestion = SERVER+'/api/'+language+'/vocabulary/game/getquestion';
    const [listQuestion, setListQuestion] = useState(Array(0))
    // const listQuestion = [{"questionId":1,"wordId":2,"word":"爱 1","meaning":"tinh yeu la chi","candidates":[{"value":"option1","id":1},{"value":"option2","id":2},{"value":"option3","id":3},{"value":"option4","id":4},{"value":"option5","id":5},{"value":"option6","id":6}]},{"questionId":1,"wordId":2,"word":"爱 2","meaning":"tinh yeu la chi","candidates":[{"value":"option1","id":1},{"value":"option2","id":2},{"value":"option3","id":3},{"value":"option4","id":4},{"value":"option5","id":5},{"value":"option6","id":6}]}];
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(null);
    const [numQuestion, SetNumQuestion] = useState(2);
    const [level, SetLevel] = useState(language===CHINESE?"HSK 1":"starter");
    const [loading, setLoading] = useState(false);
    const { heightWindow, widthWindow } = useWindowDimensions();
    const authHeader = useAuthHeader();
    const uid = useRef(-1);
    const gameId = useRef(-1);


    function SelectNumQuestion() {
        let listOption = []
        for (let i = 2; i <= 6; i++) {
            let opt = <option key={i} value={i}>{i}</option>
            listOption = [...listOption, opt]
        }
        const handleChange = (e) => {
            SetNumQuestion(e.target.value);
        };
        return (
            <select style={{marginLeft:"1%"}} value={numQuestion} onChange={handleChange}>
                {listOption}
            </select>
        )

    }

    function SelectLevel() {
        const handleChange = (e) => {
            SetLevel(e.target.value);
        };
        if(language===CHINESE){
            return (
                <select style={{marginLeft:"1%"}}value={level} onChange={handleChange}>
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    {/* <option value="HSK 4">HSK 4</option> */}
                </select>
            )
        }
        else{
            return (
                <select style={{marginLeft:"1%"}} value={level} onChange={handleChange}>
                    <option value="starter">starter</option>
                    <option value="junior">junior</option>
                    <option value="senior">senior</option>
                    <option value="master">master</option>
                    {/* <option value="HSK 4">HSK 4</option> */}
                </select>
            )
        }
        

    }

    function startGame() {

        console.log("go");
        let notResponse = true;
        axios.get(URLGetQuestion, {
            params: {
                num: numQuestion,
                level: level
            },
            headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json",'Authorization': authHeader }
            , timeout: 5000,
            
        })
            .then(function (response) {
                console.log(response);
                if (response === null) {
                    alert("Error get question !!! please contact ADMIN");
                }
                notResponse = false;
                setLoading(false);
                setListQuestion(response.data.data);
                uid.current = response.data.uid;
                gameId.current = response.data.gameId;
            })
            .catch(function (error) {
                console.log(error);
                alert("Error get question !!! please contact ADMIN");
            });
        if(notResponse)setLoading(true);
        setAnswers(Array(0));
        setCurrentQuestion(0);
    }  

    let prepareGrid = (
        detectMobile()?

        (<>
            <div><button className="generalbutton" style={{ width:"40%",height:"50px", marginTop: "5%",marginLeft:"30%" }} onClick={() => startGame()}>START</button></div>
            <div className='grid-container' style={{ marginLeft:"-5%" }}>
                <div className="grid-item">Level  <SelectLevel /></div>
                <div className="grid-item">Question <SelectNumQuestion /></div>
            </div>
        </>)
        
        :
        (< >
            <div className='grid-container'>
                <div className="grid-item">Level:<SelectLevel /></div>
                <div className="grid-item">Number of question:<SelectNumQuestion /></div>
                <div className="grid-item"><button className="generalbutton" style={{ width: "100%",height:"50px", marginTop: "-5px" }} onClick={() => startGame()}>START</button></div>
            </div>
        </>)
    )
    
    

    console.log(currentQuestion);

    console.log(answers);

    if(loading)return <div className='game'><div className='loading'>Loading ... </div></div>;

    if (answers === null) {   //init state
        return <div className='game'>{prepareGrid}</div>;
    }
    else {
        if (currentQuestion === listQuestion.length) {  // endgame & showresult state
            return <div className='game'>
                {prepareGrid}
                <LoadResult answers={answers} listQuestion={listQuestion} />
            </div>;
        }
        else {   //onplay state
            const ques = listQuestion[currentQuestion];
            console.log("onplay");
            return (<div className='game' ><HandleQuestion auth={authHeader} uid={uid.current} 
                gameId={gameId.current} question={ques} setAnswers={setAnswers} setCurrentQuestion={setCurrentQuestion} /></div>);
        }
    }

}