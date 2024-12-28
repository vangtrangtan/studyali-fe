import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';
import '../../App.css';
import WRONG_SYMBOL from '../../wrong.png';
import CORRECT_SYMBOL from '../../correct.png';
import GRID_IMG from '../../grid-background.jpg';
import EYE_ICON from '../../eye-icon.png';
import useWindowDimensions from "../useWindowDimensions";
import { CHINESE, ENGLISH, MAX_WIDTH,SERVER } from "../fileWithConstants";
import { detectMobile } from "../utils";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
// fake data generator
// const getItems = count =>
//   Array.from({ length: count }, (v, k) => k).map(k => ({
//     id: `item-${k}`,
//     // id: k,
//     content: `item ${k}`
//   }));
const convertItems = listWord =>
  listWord.map((w, idx) => ({
    id: `${idx}`,
    // id: k,
    content: w
  }));
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


const getItemStyle = (isDragging, draggableStyle,widthWindow,heightWindow) => (
  
  detectMobile()?{
    userSelect: "none",
    padding: 8*widthWindow/MAX_WIDTH * 2,
    margin: `0 ${8*widthWindow/MAX_WIDTH}px 0 0`,
    background: isDragging ? "lightgreen" : null,
    height: `${70*widthWindow/MAX_WIDTH+10}px`,
    textAlign: 'center',
    fontSize: `${25*widthWindow/MAX_WIDTH+5}px`,
    borderRadius: `${15*widthWindow/MAX_WIDTH+3}px`,
    border: `${2*widthWindow/MAX_WIDTH}px solid 	#7B3F00`,
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 10px",
    backgroundImage: isDragging ? "lightgreen" : `url(${GRID_IMG})`,
    // styles we need to apply on draggables
    ...draggableStyle
  }
  :
  {
  // some basic styles to make the items look a bit nicer

  userSelect: "none",
  padding: 8*widthWindow/MAX_WIDTH * 2,
  margin: `0 ${8*widthWindow/MAX_WIDTH}px 0 0`,
  background: isDragging ? "lightgreen" : null,
  height: `${70*widthWindow/MAX_WIDTH}px`,
  textAlign: 'center',
  fontSize: `${25*widthWindow/MAX_WIDTH}px`,
  borderRadius: `${15*widthWindow/MAX_WIDTH}px`,
  border: `${2*widthWindow/MAX_WIDTH}px solid 	#7B3F00`,
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 10px",
  backgroundImage: isDragging ? "lightgreen" : `url(${GRID_IMG})`,
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver, itemsLength) => ({
  display: "flex",
  padding: 8,
  alignItems: 'center',
  justifyContent: 'center',
});

const sendRequest = async (lang, numQuestion, level ,authHeader) => {
  const URLGetQuestion = SERVER+'/api/'+lang+'/wordorder/get';
  const res = await axios.get(URLGetQuestion, {
    params: {
      num: numQuestion,
      level: level
    },
    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json",'Authorization': authHeader }
    , timeout: 5000
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      alert("Error get question !!! please contact ADMIN");
      return null;
    });
  return res;
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

function GameWordOrderCn() {  ////lang = eng or cn

  const wordOrderData = useRef([{ "id": 54, "slashSentence": "会弹钢琴的人/羡慕/很/她/。", "items": ["会弹钢琴的人", "羡慕", "很", "她", "。"], "correctSentence": ["她很羡慕会弹钢琴的人。", "会弹钢琴的人很羡慕她。"], "meaning": "Cô ấy rất ngưỡng mộ những người biết chơi piano./Những người biết chơi piano rất ngưỡng mộ cô ấy.", "level": "HSK4" }, { "id": 59, "slashSentence": "请/从小到大的顺序/按/排列/这些数字", "items": ["请", "从小到大的顺序", "按", "排列", "这些数字"], "correctSentence": ["请按从小到大的顺序排列这些数字。", "这些数字请按从小到大的顺序排列。"], "meaning": "Hãy sắp xếp các số này theo thứ tự từ bé đến lớn.", "level": "HSK4" }, { "id": 63, "slashSentence": "对/很熟悉/我/这个城市", "items": ["对", "很熟悉", "我", "这个城市"], "correctSentence": ["我对这个城市很熟悉。", "对这个城市我很熟悉。"], "meaning": "Tôi rất thân thuộc với thành phố này.", "level": "HSK4" }, { "id": 72, "slashSentence": "好处/抽烟对你/没有/一点儿", "items": ["好处", "抽烟对你", "没有", "一点儿"], "correctSentence": ["抽烟对你没有一点儿好处。", "抽烟对你一点儿好处没有。"], "meaning": "Hút thuốc lá không có lợi cho sức khỏe.", "level": "HSK4" }, { "id": 1, "slashSentence": "这些/的/张小姐/是/都/。", "items": ["这些", "的", "张小姐", "是", "都", "。"], "correctSentence": ["这些都是张小姐的。"], "meaning": "Những cái này đều là của cô Trương.", "level": "HSK1" }, { "id": 2, "slashSentence": "我/菜/爱/不/这个/吃/。", "items": ["我", "菜", "爱", "不", "这个", "吃", "。"], "correctSentence": ["我不爱吃这个菜。"], "meaning": "Tôi không thích ăn món này.", "level": "HSK1" }, { "id": 3, "slashSentence": "在/哪儿/医生/？", "items": ["在", "哪儿", "医生", "？"], "correctSentence": ["医生在哪儿？"], "meaning": "Bác sĩ ở đâu?", "level": "HSK1" }, { "id": 4, "slashSentence": "家/怎么/我们/回/？", "items": ["家", "怎么", "我们", "回", "？"], "correctSentence": ["我们怎么回家？"], "meaning": "Bạn về nhà bằng cách gì?", "level": "HSK1" }, { "id": 5, "slashSentence": "学生/我/他/是/的/。", "items": ["学生", "我", "他", "是", "的", "。"], "correctSentence": ["他是我的学生。"], "meaning": "Cậu ấy là học sinh của tôi.", "level": "HSK1" }, { "id": 6, "slashSentence": "呢/李老师/电话/在/打/。", "items": ["呢", "李老师", "电话", "在", "打", "。"], "correctSentence": ["李老师在打电话呢。"], "meaning": "Cô Lý đang gọi điện thoại.", "level": "HSK1" }]);
  const lang = CHINESE; //eng or cn
  const [numTry, setNumTry] = useState(3);
  const [level, setLevel] = useState(lang===ENGLISH?"baby":"HSK1");
  const submitStatus = useRef(''); // '' CORRECT WRONG
  const prevSubmitValue = useRef(''); // '' CORRECT WRONG
  const questionIdx = useRef(-1);
  const question = useRef(null);
  const numQuestion = 1;
  const [warningText, setWarningText] = useState('');
  // const [items, setItems] = useState(convertItems(["现在","工作","他","个","10","小时也","星期六","不","休息","。"]));
  const [items, setItems] = useState(convertItems([]));
  const [gameState, setGameState] = useState('START'); //START -> SUBMIT -> SHOWANSWER/START -> SUBMIT 
  const [isShowMeaning, setIsShowMeaning] = useState(false);
  const [loading, setLoading] = useState(false);
  const { heightWindow, widthWindow } = useWindowDimensions();
  const uid = useRef(-1);
  const gameId = useRef(-1);
  const authHeader = useAuthHeader();
  
  function StartAndSubmitButton() {
    if(detectMobile()){ 
      if (gameState === "START" || gameState === "SHOWANSWER") {
        return (<div style={{ marginTop: "5%", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }} >
          <button className="generalbutton" style={{ width:"40%",height:"50px", marginTop: "1%"}}  onClick={() => nextQuestion()}>START</button>
          </div>);
      }
      else if (gameState === "SUBMIT") {
        return (
          <div style={{ marginTop: "5%", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{position:"absolute",marginLeft:"45%",marginTop:"-5%", fontSize:15}}>{warningText ? warningText : (numTry > 0 ? numTry + ' try left' : '')}</div>
            <button className="generalbutton" style={{ width:"40%",height:"50px", marginTop: "1%"}}  onClick={() => handleSubmit()}>SUBMIT</button>
          </div>)
      }
      else return (<div ></div>);
    }
    else{
      if (gameState === "START" || gameState === "SHOWANSWER") {
        return (<div style={{ marginTop: "68px", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }} ><button className="generalbutton" style={{ width: "200px" }} onClick={() => nextQuestion()}>START</button></div>);
      }
      else if (gameState === "SUBMIT") {
        return (
          <div style={{ marginTop: "50px", textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <div>{warningText ? warningText : (numTry > 0 ? numTry + ' try left' : '')}</div>
            <button className="generalbutton" style={{ width: "15%" }} onClick={() => handleSubmit()}>SUBMIT</button>
          </div>)
      }
      else return (<div ></div>);
    }
    
  }

  function AnswerDiv() {
    if (gameState === "SHOWANSWER") {
      return (<div className="answerzone">{question.current.correctSentence.join("/")}</div>);

    }
    else if (gameState === "SUBMIT") {
      if (isShowMeaning) {
        return (<div className="answerzone">
          {question.current.meaning}
        </div>);
      }
      else {
        return (<div className="answerzone" >
          <button className="transbutton" onClick={() => setIsShowMeaning(true)}>
            <img src={EYE_ICON} width={detectMobile()?"20px":"50%"} height={detectMobile()?"20px":"80%"} style={{ display: 'inline-block'}}></img>
          </button>
        </div>);
      }
    }
    else return (<div style={{ marginTop: "126px", textAlign: 'center' }}></div>);
  }

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    setItems(newItems);
    setWarningText('');
    submitStatus.current = '';
  }
  // const sendRequest = async(numQuestion, level)=>{
  const nextQuestion = async () => {

    if (questionIdx.current === -1 || questionIdx.current === numQuestion - 1) {
      setLoading(true);
      sendRequest(lang,numQuestion, level, authHeader).then(function (response) {
        if(response===null)return ;
        wordOrderData.current=response.data;
        questionIdx.current = 0;
        question.current = wordOrderData.current[questionIdx.current];
        uid.current = response.uid;
        gameId.current = response.gameId;
        setItems(question.current.items.map((word, index) => ({ id: `${index}`, content: `${word}` })));
        setNumTry(3);
        setGameState('SUBMIT');
        setIsShowMeaning(false);
        setLoading(false);
        submitStatus.current = '';   
      });
    }
    else {
      questionIdx.current = questionIdx.current + 1;
      question.current = wordOrderData.current[questionIdx.current];


      setItems(question.current.items.map((word, index) => ({ id: `${index}`, content: `${word}` })));
      setNumTry(3);
      setGameState('SUBMIT');
      setIsShowMeaning(false);
      submitStatus.current = '';
    }
    
  }

  function handleSubmit() {
    let userSubmit = items.map((ob, idx) => (ob.content)).join(lang==="eng"?' ':'');
    if (userSubmit === prevSubmitValue.current) {
      setWarningText('let try another answer !');
      return;
    }
    else {
      prevSubmitValue.current = userSubmit;
    }

    if (question.current.correctSentence.findIndex(a => a === userSubmit) !== -1) {
      setGameState('SHOWANSWER');
      setNumTry(0);
      submitStatus.current = 'CORRECT';
      sendResult(authHeader, uid.current, gameId.current, question.current.id, "correct");
    }
    else {
      submitStatus.current = 'WRONG';
      if (numTry === 1) {
        setGameState('SHOWANSWER');
        sendResult(authHeader,uid.current, gameId.current, question.current.id, "wrong");
      }

    }
    setNumTry(numTry - 1);
  }

  function SubmitStatusDiv() {
    if(detectMobile()){
      if (submitStatus.current === 'CORRECT') return <img src={CORRECT_SYMBOL} width={20} height={20} style={{ display: 'inline-block' }}></img>;
      else if (submitStatus.current === 'WRONG') return <img src={WRONG_SYMBOL} width={20} height={20} style={{ display: 'inline-block' }}></img>;
      else return <img src={WRONG_SYMBOL} width={20} height={20} style={{ display: 'inline-block', visibility: 'hidden' }}></img>; //this trick is to fix grids position
    }
    else{
      if (submitStatus.current === 'CORRECT') return <img src={CORRECT_SYMBOL} width={40} height={40} style={{ display: 'inline-block' }}></img>;
      else if (submitStatus.current === 'WRONG') return <img src={WRONG_SYMBOL} width={40} height={40} style={{ display: 'inline-block' }}></img>;
      else return <img src={WRONG_SYMBOL} width={40} height={40} style={{ display: 'inline-block', visibility: 'hidden' }}></img>; //this trick is to fix grids position
    }
    
  }


  if(loading)return <div className='loading'>Loading ... </div>;
  
  return (
    <div className="game">
      <div style={{ margin: "5px", display: 'flex', flexDirection: 'row', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
        <DragDropContext onDragEnd={onDragEnd} >
          <Droppable droppableId="droppable" direction="horizontal" >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, items.length)}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <Draggable isDragDisabled={gameState === "SHOWANSWER"} key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                          widthWindow,
                          heightWindow
                        )}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>

            )}
          </Droppable>

        </DragDropContext>
        <SubmitStatusDiv />
      </div>
      <div>
        <AnswerDiv />
        <StartAndSubmitButton />

      </div>
    </div>
  );
}

export default GameWordOrderCn