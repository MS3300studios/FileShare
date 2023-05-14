export const getUser = () => {
    let userData = sessionStorage.getItem("userData");
    if(userData){
        return JSON.parse(userData);
    }
    userData = localStorage.getItem("userData");
    if(userData) 
        return JSON.parse(userData)
    else return null;
}