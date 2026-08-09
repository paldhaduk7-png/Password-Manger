import jwt from "jsonwebtoken";

//next -> send in in next route
const isAuthenticated=async (req,res, next)=>{

     try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false
            });
        }

    //if token exist then decode them    
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if(!decode){
        return res.status(401).json({
            message: "Invalid or expired token. Please log in again.",
            success: false
        });
        
    }

    //this req.id into a updateprofile
    req.id=decode.userId;
    next();

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Authentication error",
            success: false
        });
     }
}

export default isAuthenticated;