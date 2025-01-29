import {
    MDBCol,
    MDBContainer,
    MDBInput,
    MDBRow
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../App.css';
import "../../css/createExcercise.css"
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { CHINESE, ENGLISH, SERVER } from '../fileWithConstants';
import { getLangFromLocalStorage } from '../utils';
import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import Home from '../HomePage';

function SelectLang({ lang, setLang }) {
    return (
        <div style={{ display: "flex", fontSize: "16px" }}>
            <div>Language: </div>
            <select style={{ fontSize: "18px", marginBottom: "20px", position: "relative", marginLeft: "10px" }}
                value={lang} onChange={e => { setLang(e.target.value) }}>
                <option value={CHINESE} >Chinese</option>
                <option value={ENGLISH} >English</option>
            </select>
        </div>
    )
}

function AddStatement({ statement, setStatement }) {
    const MAX_LENGTH = 300;
    const handleStatement = (e) => {
        if (e.target.value.length <= MAX_LENGTH) setStatement(e.target.value);
    };
    const limitCharColor = (statement.length >= MAX_LENGTH ? "red" : "grey");
    return (
        <div className="mb-2 statementInput">
            <MDBRow>
                <MDBCol >  <label className="form-label">Statement:</label></MDBCol >
                <MDBCol lg="4"  >   <p style={{ fontSize: "12px", color: limitCharColor }}>{statement.length}/{MAX_LENGTH} characters</p></MDBCol >
            </MDBRow>
            <textarea maxLength={MAX_LENGTH} className="form-control" onChange={handleStatement} value={statement}></textarea>
        </div>
    )
}

function AddExerciseName({ name, setName }) {
    const MAX_LENGTH = 60;
    const handleName = (e) => {
        if (e.target.value.length <= MAX_LENGTH) setName(e.target.value);
        else {
            alert("name is too long ! max length is " + MAX_LENGTH);
        }
    };
    return (
        <>
            <p className="mb-0">Name:</p>
            <MDBInput maxLength={MAX_LENGTH} wrapperClass='mb-2' placeholder='name' value={name} type='text' onChange={(e) => handleName(e)} />
        </>
    )
}

function AddOption({ numOption, setNumOption, optionValues, setOptionValues, correctId, setCorrectId }) {
    const MAX_OPTION_LENGTH = 100;
    const handleNumOption = (e) => {
        var num = e.target.value;
        if (num < optionValues.length) {
            setOptionValues(
                optionValues.filter(a =>
                    a.id <= num
                )
            );
            if (num < correctId) setCorrectId(0);
        }
        else if (num > optionValues.length) {
            var addE = [];
            for (var i = optionValues.length + 1; i <= num; i++) {
                addE = [...addE, { id: i, value: "" }];
            }
            setOptionValues(
                [
                    ...optionValues,
                    ...addE
                ]
            );
        }
        setNumOption(num);
    };

    const SelectNumOption = () => {
        return (
            <div style={{ display: "flex", fontSize: "16px" }}>
                <div>Option: </div>
                <select style={{ fontSize: "18px", marginBottom: "20px", position: "relative", marginLeft: "10px" }} value={numOption} onChange={handleNumOption}>
                    <option value={4} >4</option>
                    <option value={5} >5</option>
                    <option value={6} >6</option>
                </select>
            </div>
        )
    }

    const handleOption = (idOp, e) => {
        if (e.target.value.length <= MAX_OPTION_LENGTH) {
            const newOption = optionValues.map((v) => {
                if (v.id === idOp) {
                    return { id: v.id, value: e.target.value };
                } else {
                    return v;
                }
            });
            setOptionValues(newOption);
        }
        else {
            alert("option value is too long ! max length is " + MAX_OPTION_LENGTH);
        }
    };

    return (
        <>
            <SelectNumOption />
            <MDBRow><MDBCol className="col-1 fs-6">✅</MDBCol></MDBRow>
            <MDBRow>
                <MDBCol className='col-1' style={{ paddingTop: "2%" }}>
                    <Form onChange={e => { setCorrectId(Number(e.target.value)) }}>
                        {
                            optionValues.map(v =>
                                <MDBRow key={v.id} className='mb-0' style={{ height: "50px" }}>
                                    <Form.Check inline name="group1" type="radio" id={`inline-radio-${v.id}`} checked={v.id === correctId} readOnly value={v.id} />
                                </MDBRow>)
                        }

                    </Form>
                </MDBCol>
                <MDBCol className='col-10'>
                    {
                        optionValues.map(v => <MDBRow style={{ height: "50px" }} key={v.id}>
                            <MDBInput maxLength={MAX_OPTION_LENGTH} wrapperClass='mb-0' placeholder={String.fromCharCode('A'.charCodeAt(0) + v.id - 1)}
                                key={v.id} value={v.value} type='text' onChange={(e) => handleOption(v.id, e)} />
                        </MDBRow>)
                    }
                </MDBCol>
            </MDBRow>

        </>
    )
}

function SelectTimeLimit({ timeLimit, setTimeLimit }) {
    return (
        <div style={{ display: "flex", fontSize: "16px", marginTop: "20px" }}>
            <div>Time Limit (in second): </div>
            <select style={{ fontSize: "18px", marginBottom: "20px", position: "relative", marginLeft: "10px" }}
                value={timeLimit === 0 ? "None" : timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
                <option value={0} >None</option>
                <option value={5} >5</option>
                <option value={10} >10</option>
                <option value={20} >20</option>
                <option value={30} >30</option>
                <option value={60} >60</option>
            </select>
        </div>
    )
}

function AddTargetUser({ targetUser, setTargetUser, targetType, setTargetType }) {
    const MAX_LENGTH = 300;
    const handleTargetUser = (e) => {
        if (e.target.value.length <= MAX_LENGTH) setTargetUser(e.target.value);
    };
    const handleTargetType = (e) => {
        if (e.target.value !== targetType) {
            setTargetType(e.target.value);
        }
    };
    return (
        <div className="mb-2 targetUser">
            <div style={{ display: "flex", fontSize: "16px", marginTop: "20px" }}>
                <div>Target User: </div>
                <select style={{ fontSize: "18px", marginBottom: "20px", position: "relative", marginLeft: "10px" }}
                    value={targetType} onChange={handleTargetType}>
                    <option value={"none"} >None</option>
                    <option value={"all"} >Public</option>
                    <option value={"user"} >Custom</option>
                </select>
            </div>
            {targetType === "user" && <textarea maxLength={MAX_LENGTH} placeholder='nhập các username ngăn cách bởi dấu phẩy, ví dụ user1,user2,user3'
                className="form-control" onChange={handleTargetUser} value={targetUser === null ? "" : targetUser}></textarea>}
        </div>
    )
}

function AddExplain({ explain, setExplain }) {
    const MAX_LENGTH = 400;
    const handleExplain = (e) => {
        if (e.target.value.length <= MAX_LENGTH) setExplain(e.target.value);
    };
    const limitCharColor = (explain.length >= MAX_LENGTH ? "red" : "grey");
    return (
        <div className="mb-2 explainInput">
            <MDBRow>
                <MDBCol >  <label className="form-label">Explain:</label></MDBCol >
                <MDBCol lg="4"  >   <p style={{ fontSize: "12px", color: limitCharColor }}>{explain.length}/{MAX_LENGTH} characters</p></MDBCol >
            </MDBRow>
            <textarea maxLength={MAX_LENGTH} className="form-control" onChange={handleExplain} value={explain}></textarea>
        </div>
    )
}

function sendExercise(props) {

    var dataObj = {
        statement: props.statement,
        name: props.name,
        timeLimit: props.timeLimit,
        correctId: props.correctId,
        language: props.lang,
        options: props.optionValues,
        targetType: props.targetType,
        explain: props.explain,
    };
    if (props.targetUser !== null) {
        dataObj.targetUser = props.targetUser;
    }

    const handleResquest = async () => {
        try {
            const response = await axios.post(SERVER + '/api/exercise/create', dataObj,
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': props.auth }
                }
            );

            if (response.data.status === false) {
                alert(response.data.message);
            }
            else {
                alert("save succcess !");
                props.navigate("/gym/own");
            }
        } catch (error) {
            // Handle signup error
            console.error('sendExercise failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}

export default function Create() {
    var localLang = getLangFromLocalStorage();
    const [lang, setLang] = useState(localLang === null ? ENGLISH : localLang);
    const [name, setName] = useState("");
    const [statement, setStatement] = useState("");
    const [timeLimit, setTimeLimit] = useState(0);
    const [numOption, setNumOption] = useState(4);
    const [optionValues, setOptionValues] = useState([{ id: 1, value: "" }, { id: 2, value: "" }, { id: 3, value: "" }, { id: 4, value: "" }]);
    const [explain, setExplain] = useState("");
    const [correctId, setCorrectId] = useState(0);
    const [error, setError] = useState(" ");
    const [targetUser, setTargetUser] = useState("")
    const [targetType, setTargetType] = useState("none");
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    // console.log(typeof(correctId));
    const createHandle = (e) => {
        if(statement.length===0 || name.length===0){
            setError("name, statement không được để trống");
        }
        if (correctId === 0 || correctId > optionValues.length) {
            setError("hãy tick chọn option đúng");
        }
        else if (targetType === "user" && (targetUser === null || targetUser.trim() === "")) {
            setError("target user không được để trống");
        }
        else {
            sendExercise({ navigate, statement, name, timeLimit, correctId, lang, optionValues, targetType, targetUser, explain, auth: authHeader });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-50" style={{ backgroundColor: "#f3e7d1d9" }}>
            <div className="p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <SelectLang lang={lang} setLang={setLang} />
                    <AddExerciseName name={name} setName={setName} />
                    <SelectTimeLimit timeLimit={timeLimit} setTimeLimit={setTimeLimit} />
                    <AddStatement statement={statement} setStatement={setStatement} />
                    <AddOption
                        numOption={numOption}
                        setNumOption={setNumOption}
                        optionValues={optionValues}
                        setOptionValues={setOptionValues}
                        correctId={correctId}
                        setCorrectId={setCorrectId}
                    />
                    <AddExplain explain={explain} setExplain={setExplain} />
                    <AddTargetUser targetType={targetType} setTargetType={setTargetType} targetUser={targetUser} setTargetUser={setTargetUser} />
                    {error && <p className="text-danger d-flex justify-content-center align-items-center" style={{ marginTop: "100px" }}>{error}</p>}
                    <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} >
                        <button type="button" className="btn btn-primary btn-rounded col-3" data-mdb-ripple-init onClick={createHandle}>Save</button>
                    </div>

                </MDBContainer>
            </div>
        </div>
    )

}


function sendUpdateExercise(nav, props) {

    const handleResquest = async () => {
        try {
            const response = await axios.patch(SERVER + '/api/exercise/update/' + props.id, props,
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': props.auth }
                }
            );

            if (response.data.status === false) {
                alert(response.data.message);
            }
            else {
                alert("save succcess !");
                nav(-1);
            }
        } catch (error) {
            console.error('sendExercise failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}

export function Edit() {
    const question = useLocation().state;
    const nav = useNavigate();

    const [lang, setLang] = useState(question === null ? null : question.language);
    const [name, setName] = useState(question === null ? null : question.name);
    const [statement, setStatement] = useState(question === null ? null : question.statement);
    const [timeLimit, setTimeLimit] = useState(question === null ? null : question.timeLimit);
    const [optionValues, setOptionValues] = useState(question === null ? null : question.options);
    const [explain, setExplain] = useState(question === null ? "" : question.explain);
    const [numOption, setNumOption] = useState(question === null ? null : question.options.length);
    const [correctId, setCorrectId] = useState(question === null ? null : question.correctOptionId);
    const [targetUser, setTargetUser] = useState(question === null ? null : question.targetUser);
    const [targetType, setTargetType] = useState(question === null ? null : question.targetType);
    const [error, setError] = useState(" ");
    const authHeader = useAuthHeader();

    if (question == null) {    //fix here when sb type /exercise/edit on url bar
        //add id to url
        // check if data not in state then send request from server 
        return <Home/>;
    }
    const editHandle = (e) => {
        if(statement.length===0 || name.length===0){
            setError("name, statement không được để trống");
        }
        else if (correctId === 0 || correctId > optionValues.length) {
            setError("hãy tick chọn option đúng");
        }
        else if (targetType === "user" && (targetUser === null || targetUser.trim() === "")) {
            setError("target user không được để trống");
        }
        else {
            // chi gui statement vs explain khi diff old version
            var dataObj = { id: question.id, statement, name, timeLimit, correctId, language: lang, options: optionValues, explain, auth: authHeader }
            if (targetType !== question.targetType || (targetUser !== null && targetUser !== question.targetUser)) {
                dataObj.targetType = targetType;
                dataObj.targetUser = (targetUser === null ? "" : targetUser);
            }
            sendUpdateExercise(nav, dataObj);
        }
    };
    const cancelHandle = (e) => {
        nav(-1);
    };

    return (
        <MDBContainer className="py-1 gymMainWrap" style={{ height: "100%" }}>
            <div className="d-flex justify-content-center align-items-center vh-50" style={{ backgroundColor: "#f3e7d1d9" }}>
                <div className="p-4" style={{ width: '500px', height: 'auto' }}>
                    <MDBContainer className="p-3">
                        <SelectLang lang={lang} setLang={setLang} />
                        <AddExerciseName name={name} setName={setName} />
                        <SelectTimeLimit timeLimit={timeLimit} setTimeLimit={setTimeLimit} />
                        <AddStatement statement={statement} setStatement={setStatement} />
                        <AddOption
                            numOption={numOption}
                            setNumOption={setNumOption}
                            optionValues={optionValues}
                            setOptionValues={setOptionValues}
                            correctId={correctId}
                            setCorrectId={setCorrectId}
                        />
                        <AddExplain explain={explain} setExplain={setExplain} />
                        <AddTargetUser targetType={targetType} setTargetType={setTargetType} targetUser={targetUser} setTargetUser={setTargetUser} />
                        {error && <p className="text-danger d-flex justify-content-center align-items-center" style={{ marginTop: "100px" }}>{error}</p>}
                        <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} >
                            <button type="button" className="btn btn-secondary btn-rounded col-3" data-mdb-ripple-init onClick={cancelHandle}>Cancel</button>
                            <button type="button" className="btn btn-primary btn-rounded col-3  ms-2" data-mdb-ripple-init onClick={editHandle}>Save</button>
                        </div>

                    </MDBContainer>
                </div>
            </div>
        </MDBContainer>
    )

}