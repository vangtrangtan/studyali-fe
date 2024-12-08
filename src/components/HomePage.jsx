import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { checkLoginManual, detectMobile } from "./utils";

const Home = () => {
    const authHeader = useAuthHeader();
    const authUser = useAuthUser();
    console.log(authHeader);
    console.log(authUser);
    let content = ""
    if(checkLoginManual()){
        content=(<h3>Hello {authUser.name} ! welcome to Studyali app</h3>)
    }
    else{
        
        content=(<p>You can use the public account (username: studyali / password: 123) or register your own account</p>)
        
    }
    if(detectMobile()){
        return <div style={{marginLeft:"10%",marginRight:"10%"}}>{content}</div>
    }
    else{
        return <div style={{marginLeft:"25%",marginRight:"25%"}}>{content}</div>
    }
}

export default Home;
