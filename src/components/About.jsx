import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { detectMobile } from "./utils";

const About = () => {
    console.log(useIsAuthenticated());
    const authHeader = useAuthHeader();
    const authUser = useAuthUser();
    console.log(authHeader);
    console.log(authUser);
    const content = (
        <>
        <h3>Hi, I'm Thi Dai Loc (a.k.a vangtrangtan) and welcome to my website</h3>
        <p>This is my personal website for study purpose.</p>
        <p>Currently, I am studying Chinese and I want to build this website for supporting foreign language learner community for free.</p>
        <p>Here you can practise both English and Chinese by playing with exercises.</p>
        </>
    );
    if(detectMobile()){
        return <div style={{marginLeft:"10%",marginRight:"10%", height:"100vh"}}>{content}</div>
    }
    else{
        return <div style={{marginLeft:"25%",marginRight:"25%", height:"100vh"}}>{content}</div>
    }
}

export default About;
