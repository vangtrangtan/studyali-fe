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
            <h4>Server tiếng Anh</h4>
            <p>Server tiếng Anh mang đến hai loại bài tập là trắc nghiệm từ vựng và sắp xếp câu,
                trong đó phần từ vựng giúp ôn tập từ vựng hiện đang hỗ trợ 3 cấp độ:
            </p>
            <ul>
                <li><p>Starter: top 100 từ vựng đơn giản và phổ biết nhất</p></li>
                <li><p>Junior: top 300 từ vựng phổ biết nhất - tương ứng level A1</p></li>
                <li><p>Senior: 500 từ vựng nằm trong top 2000 từ vựng phổ biết nhất - tương ứng level B1</p></li>
            </ul>
            <p>Phần sắp xếp câu cung cấp gần 100 bài tập với độ khó A1</p>
            <h4>Server tiếng Trung</h4>
            <p>Server tiếng Trung mang đến hai loại bài tập là trắc nghiệm từ vựng và sắp xếp câu,
                trong đó phần từ vựng hiện đang hỗ trợ 4 cấp độ HSK1-4, với số lượng từ vựng tương ứng 150,150, 300, 600 giúp bạn ôn tập mặt chữ hán tự.

            </p>
            <p>Phần sắp xếp câu cung cấp gần 100 bài tập với độ khó HSK1-4</p>
            <h4>Bài tập ở cả hai Server tiếng Anh và Tiếng Trung sẽ thường xuyên được cập nhật và thêm mới trong thời gian tới</h4>
        </article>
    </>)
    if (detectMobile()) {
        // if (true) {
            // return <div style={{ marginLeft: "10%", marginRight: "10%" }}>{content}</div>
            return (
                <div style={{ marginLeft: "5%", marginRight: "10%" }}>
                    <div className="contentdiv" style={{ float: 'left'}}>{content}</div>
                    <div className="sidebar" style={{ float: 'right' }}>
                        <TopScore />
                    </div>
                </div>
            )
        }
        else {
            // return <div className="contentdiv">{content}</div>
            return (
                <div className="container" style={{ marginLeft: "15%"}}>
                    <div className="contentdiv" style={{ float: 'left' }} >{content}</div>
                    <div className="sidebar" style={{ float: 'right', marginLeft: "0%" }}>
                        <TopScore />
                    </div>
                </div>
            )
    
        }
}

export default Home;
