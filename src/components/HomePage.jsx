import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { checkLoginManual, detectMobile } from "./utils";
import TopScore from "./Sidebar/TopScore";
import "../css/homepage.css"

const Home = () => {
    const authHeader = useAuthHeader();
    const authUser = useAuthUser();
    // console.log(authHeader);
    // console.log(authUser);
    let content = (<>
        <h3>Hello {checkLoginManual()?authUser.name:""} ! welcome to Studyali app</h3>
        <article>
            <p>Studyali cung cấp hai chức năng chính: </p>
            <ul>
                <li><p>Bài tập có tính điểm ranking ở mục <b>Vocabulary</b> (trắc nghiệm từ vựng), <b>WordOrder</b> (sắp xếp câu)</p></li>
                <li><p>Bài tập không tính điểm do người dùng tạo và target cho nhau ở mục <b>Gym</b></p></li>
            </ul>
            <p>Studyali hiện có hai server là Tiếng Anh và Tiếng Trung, có thể cài đặt mặc định trong mục <b>Profile</b> {'->'} <b>Setting</b>   </p>
            <p>Bài tập ranking ở Server tiếng Anh có 4 cấp độ:</p>
            <ul>
                <li><p>Starter: top 100 từ vựng đơn giản và phổ biết nhất</p></li>
                <li><p>Junior: top 300 từ vựng phổ biết nhất - tương ứng level A1</p></li>
                <li><p>Senior: từ vựng level B1</p></li>
                <li><p>Master: từ vựng level B2</p></li>
            </ul>
            <p>Bài tập ranking ở Server tiếng Trung có 4 cấp độ: HSK1-4</p>
            <h4>Bài tập sẽ thường xuyên được cập nhật và thêm mới trong thời gian tới</h4>
        </article>
    </>)

    let content2 = (<>
    <article>
        <h3>Tổng kết mùa S20251:</h3>
        <p>Mùa S20251 kéo dài từ tháng 12/2024 đến 28/3/2025 với 1112 lượt submit trong đó có 866 câu trả lời đúng. </p>
        <p>Top 3 user:</p>
        <ul>
            <li><p style={{color: "blue", fontWeight:"bold"}}>🥇 Kirigakure_Garbaca</p></li>
            <li><p style={{color: "green", fontWeight:"bold"}}>🥈 changemaker</p></li>
            <li><p style={{color: "green", fontWeight:"bold"}}>🥉 binpro111wer</p></li>
        </ul>
        <p>mùa S20252 sẽ bắt đầu từ 29/3</p>
    </article>
</>)
    if (detectMobile()) {
        // if (true) {
            // return <div style={{ marginLeft: "10%", marginRight: "10%" }}>{content}</div>
            return (
                <div style={{ marginLeft: "5%", marginRight: "10%" }}>
                    <div className="contentdiv" style={{ float: 'left'}}>{content2}</div>
                    
                    <div className="sidebar" style={{ float: 'right' }}>
                        <TopScore />
                    </div>
                    <div className="contentdiv" style={{ float: 'left'}}>{content}</div>
                </div>
            )
        }
        else {
            // return <div className="contentdiv">{content}</div>
            return (
                <div className="container" style={{ marginLeft: "15%"}}>
                    <div className="contentdiv" style={{ float: 'left'}}>{content2}</div>
                    
                    <div className="sidebar" style={{ float: 'right', marginLeft: "0%" }}>
                        <TopScore />
                    </div>
                    <div className="contentdiv" style={{ float: 'left' }} >{content}</div>
                </div>
            )
    
        }
}

export default Home;
