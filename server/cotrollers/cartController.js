import User from "../models/User.js";

// update user cartData : /api/cart/update

export const updatecart = async (req , res)=>{
    try {
        const {cartItems} = req.body;
        await User.findByIdAndUpdate(req.user_Id , {cartItems});
        res.json({
            success : true,
            message : 'Cart updated'
        })
    } catch (error) {
        console.log(error.message)
        res.json({success : false, message : error.message});
    }
}