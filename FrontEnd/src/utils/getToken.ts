export const getToken = () => {
    let token = sessionStorage.getItem("token");
    if(token){
        return token;
    }
    token = localStorage.getItem("token");
    return token;
}