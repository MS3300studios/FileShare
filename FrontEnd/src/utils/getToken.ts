export const getToken = () => {
    let token = sessionStorage.getItem("token");
    if(token){
        return token;
    }
    token = localStorage.getItem("token") || "no token";
    return token;
}