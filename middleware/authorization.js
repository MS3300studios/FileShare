const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const userToken = req.headers.authorization;
        const decoded = jwt.decode(userToken, process.env.SECRET);
        console.log(decoded)
        const expDate = new Date(decoded.exp * 1000);
        if(expDate > new Date()){
            req.userData = decoded;
            console.log('authorized middleware')
            next();
        } else {
            console.log('unauthorized middleware')
            return res.sendStatus(401); //expired
        }
        
    } catch(error){
        console.log('unauthorized middleware caught error')
        console.log(error)
        return res.sendStatus(401);
    }
}