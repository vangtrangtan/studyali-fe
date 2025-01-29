import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import "../../css/gymMain.css";
import { CHINESE, ENGLISH } from '../fileWithConstants';

import { MDBContainer } from 'mdb-react-ui-kit';
import { chinesePublicData, englishPublicData } from '../../gymPublicData';
import { detectMobile } from '../utils';
import { Exercise } from './excercise';


function ShowExerciseList({ language }) {
    var exerciseList = null;
    if (language === CHINESE) {
        exerciseList = chinesePublicData;
    }
    else {
        exerciseList = englishPublicData;
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
                            <th scope="row">{idx + 1}</th>
                            <td><a href={`/exercise/public?id=${idx + 1}&language=${language}`} style={{ color: "mediumblue" }}>{e.name}</a></td>
                            <td>{e.authorName}</td>
                        </tr>)
                    }
                </tbody>
            </table>
            <h3 style={{ textAlign: 'center' }}>---  Login for more exercise  ---</h3>
        </>
    )
}


export function ExercisePublic() {
    const [searchParams, setSearchParams] = useSearchParams();
    var exId = searchParams.get("id");
    var language = searchParams.get("language");
    var exercise = null;
    var data = null;
    if (language === ENGLISH) {
        data = englishPublicData;
    }
    else if (language === CHINESE) {
        data = chinesePublicData;
    }
    else {
        return <div className='loading'>No such exercise !</div>;
    }


    if ((/[0-9\b]+$/.test(exId)) && exId <= data.length && exId > 0) {
        exercise = data[exId - 1];
        return <Exercise question={exercise} sendResToServer={false} />
    }
    else {
        return <div className='loading'>No such exercise !</div>;
    }
}


export default function GymPublic({ language }) {
    return (
        <section>
            <MDBContainer className="py-1 gymMainWrap" style={{ height: "100%" }}>
                <ShowExerciseList language={language} />

            </MDBContainer>
        </section>
    )

}