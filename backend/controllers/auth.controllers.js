import User from "../models/User.js";
import bcryptjs from "bcryptjs"
import { createAccessToken } from "../libs/jwt.js";


const register = async(req,res)=>{
    const { username, email, password } = req.body

    try {
        const passwordHash = await bcryptjs.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: passwordHash
        })

        const userSaved = await newUser.save()

        const token = await createAccessToken({id: userSaved._id})
   
        res.cookie('token', token)
        
        res.header('Custom-Header', 'Some-Value')


         res.json({userSaved, token})
    } catch (error) {
        res.status(500).json({message : error.message})
        console.log(error);
    }
}

const login = async(req,res)=>{
    const {email, password}= req.body

    try {
        const userFound = await User. findOne({email})

        if(!userFound) {
            return res.status(400).json({message: 'user not found'})
        }

        const isMatch =await bcryptjs.compare(password, userFound.password)

        if(!isMatch) {
            return res.status(400).json({message: 'Incorrect Paswordd'})

        }

        const token = await createAccessToken({id: userFound._id})
   
        res.cookie('token', token)

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token
        })

    } catch (error) {
        res.status(500).json({message : error.message})
        console.log(error);
    }
}

const logout = async(req,res)=>{
    try {
        res.cookie('token',"",{
            expires: new Date(0)
        })
        return res.sendStatus(200)
        
    } catch (error) {
        res.status(500).json({message : error.message})
        console.log(error);
    }
}


export {
    register,
    login,
    logout
}