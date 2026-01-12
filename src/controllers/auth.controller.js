import knex from 'knex';
import knexConfig from '../../knexfile.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const db = knex(knexConfig.development);

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        //check if user exists
        const existingUser = await knex("users").where({email}).first();
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        //hash password 
        const hashedPassword = await bcrypt.hash(password, 10);
        //create user
        const [newUser] = await knex("users").insert({
            name,
            email,
            password: hashedPassword,
        })
        .returning(["id", "name", "email"]);
        res.status(201).json({message: "User registered successfully", user: newUser});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }

};
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await knex("users").where({email}).first();
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            { id: user.id, email: user.email},
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "1h"}

        );
        res.json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};

export default { register, login };