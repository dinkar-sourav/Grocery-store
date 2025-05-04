import jwt from 'jsonwebtoken';
// /api/seller/login

export const sellerLogin = async (req , res)=>{
    const {email , password} = req.body;
    try {
        if(password ===process.env.admin_PASSWORD && email===process.env.admin_EMAIL) {
            const token = jwt.sign({email} , process.env.JWT_SECRET , {expiresIn : '7d'});
    
            res.cookie('sellerToken' , token , {
                httpOnly :true,
                secure : process.env.NODE_ENV === 'production',
                sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge : 7*24*60*60*100
            })
    
            res.json({
                success : true,
                message : "seller logged in"
            })
        }else {
            res.json({
                success : false,
                message : "Invalid credentials"
            })
        }
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false ,
            message : error.message
        })
    }
}

// /api/seller/is-auth

export const isSellerAuth = async (req, res)=>{
    try {
        return res.json({
            success : true
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false ,
            message : error.message
        })
    }
}

// seller logout

export const sellerLogout = async (req , res)=>{
    try {
        res.clearCookie('sellerToken', {
            httpOnly : true,
            secure : process.env.NODE_ENV ==='production',
            sameSite : process.env.NODE_ENV ==='production' ? 'none' : 'strict',
        });
        return res.json({
            success : true,
            message : "Logged Out successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            success : false ,
            message : error.message
        })
    }
}