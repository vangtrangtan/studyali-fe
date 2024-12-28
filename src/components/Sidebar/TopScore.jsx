import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/sidebar.css'
import { ChevronDoubleLeft, ChevronDoubleRight } from 'react-bootstrap-icons';

import { useState } from 'react';
import { detectMobile } from '../utils';
import { SERVER } from '../fileWithConstants';
import axios from 'axios';

function sendTop10Request(setData) {
    const handleResquest = async () => {
        try {
            const response = await axios.get(SERVER + '/home/scoreboard',
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json" }
                    , timeout: 3000
                }
            );
            setData(response.data);
        } catch (error) {
            console.error('sendTop10Request failed:', error.response ? error.response.data : error.message);
        }
    };
    handleResquest();
}

const Scoreboard = () => {
    const [data, setData] = useState([]);
    if (data.length === 0) sendTop10Request(setData);
    let rows = [];

    for (var i = 1; i <= Math.min(10,data.length); i++) {
        rows = [...rows, (
            <tr key={i}>
                <td width="10%">{data.length >= i ? data[i - 1].rank : ""}</td>
                <td width="70%" style={{fontWeight:"bold", color:"gray"}}>{data.length >= i ? data[i - 1].username : ""}</td>
                <td width="20%">{data.length >= i ? data[i - 1].score : ""}</td>
            </tr>
        )]
    }
    return (
        <div className="topuser">
            <div className='caption'>👑 Top Server</div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th >Rank</th>
                        <th>Nickname</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

const TopScoreForMobile = () => {
    const [openSideBar, setOpenSideBar] = useState(false);

    if (openSideBar) {

        return (
            <div style={{ width: "280px", right: "0px", position: "absolute" }}>
                <button style={{ width: "10px", float: 'left', display: "inline-block" }} type="button" className="btn btn-secondary" onClick={() => setOpenSideBar(false)}>
                    <ChevronDoubleRight size={15} color='black' style={{ marginLeft: "-5px" }} />
                </button>
                <div className="sidebar" style={{ float: 'right', marginRight: "0px" }}>
                    <Scoreboard />
                </div>
            </div>
        )

    }
    else {
        return (
            <div style={{ right: "10px", position: "absolute", display: "flex" }}>
                <button style={{ width: "10px" }} type="button" className="btn btn-secondary" onClick={() => setOpenSideBar(true)}>
                    <ChevronDoubleLeft size={15} color='black' style={{ marginLeft: "-5px" }} />
                </button>

            </div>
        )

    }
}
const TopScoreForDesktop = () => {
    return (
        <div className="wrapper">
            <div className="sidebar">
                <Scoreboard />
            </div>
        </div>

    )
}

const TopScore = () => {
    if (detectMobile()) {
        // if(true){
        return <TopScoreForMobile />
    }
    else {
        return <TopScoreForDesktop />
    }
}

export default TopScore;
