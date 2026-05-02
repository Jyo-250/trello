const jwt = require("jsonwebtoken");
function authMiddleware(req,res,next){
    const token = req.headers.token;
    
    if(!token){
        res.status(403).send({
            message: "You are not signed in"
        });
        return;
    }

    const decoded = jwt.verify(token, "jyothsna123");
    const userId = decoded.userId;

    if(!userId){
        res.status(403).json({
            message: "malformed token"
        })
        return;
    }

    req.userId = userId;

    next();
}

module.exports = {
    authMiddleware
}