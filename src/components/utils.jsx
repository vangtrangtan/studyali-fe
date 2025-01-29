export function detectMobile() {
    return ( ( window.innerWidth <= 960 ) );
}
export function checkLoginManual(){
    const tokenString = localStorage.getItem('_auth_');
    return (tokenString!==null);
};
export function getDefaultServerFromCLient(){
    const tokenString = localStorage.getItem('_auth__state');
    if(tokenString===null)return null;
    const userToken = JSON.parse(tokenString);
    return userToken.default_server;
};

export function saveLangToLocalStorage(lang){
    localStorage.setItem('_studyali_lang_',lang);
} 
export function getLangFromLocalStorage(){
    return localStorage.getItem('_studyali_lang_');
} 