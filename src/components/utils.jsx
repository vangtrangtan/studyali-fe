export function detectMobile() {
    // console.log("width"+window.innerWidth);
    // console.log("width"+window.innerHeight);
    return ( ( window.innerWidth <= 960 ) );
}
export function checkLoginManual(){
    const tokenString = localStorage.getItem('_auth_');
    // const userToken = JSON.parse(tokenString);
    return (tokenString!==null);
};