import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
const saltRounds = 10;

const authController = {};

export const signup = async (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    // validate if any field is empty or not
    if ([username, email, password].some((val) => val?.trim === "")) {

        throw new Error("All fields are required");
    }

    // check if user already exists
    try {
        const user = await UserModel.findOne({
            $or: [{ "email": email }, { "username": username }],
        });

        if (user) {
            // User exists
            console.error('User already exists:', user);
            throw new Error("User already exists");
        }
    } catch (error) {
        // Handle any errors
        console.error('Error checking user:', error);
        throw new Error('Error checking user');
    }


    // hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const newUser = new UserModel({
        username,
        "password": hashedPassword,
        email
    });
    // Save the user to the database
    const savedUser = await newUser.save().then((data) => {
        res.status(201).json(data);
    }).catch((error) => {
        throw new Error("User not created");
    });

};






export const login = async (req, res) => {
    const { email, password } = req.body;
// console.log(req);
    // Validate if any field is empty
    if (!email || !password) {
        return res.status(400).json({ "error": 'Email and password are required' });
    }

    try {

        const user = await UserModel.findOne({
            "email": email
        });

        if (!user) {
            // User with the provided email does not exist
            return res.status(404).json({ "error": 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            // Passwords do not match
            return res.status(401).json({ "error": 'Invalid password' });
        }

        const token = jwt.sign(
            { user_id: user._id }, // Changed to user._id for JWT payload
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        if (!token) {
            throw new Error("Token not created");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        // Passwords match, login successful
        return res
            .status(200)
            .cookie("token", token, options)
            .json({
                "token": token,
            });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ "error": 'Internal Server Error' });
    }
};



export const logout = async (req, res) => {

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(
     "Logout successful"
    );

};

export const verifyToken = async (req, res) => {
    return res
        .status(200)
        .cookie("token", req.cookies.token, {
            httpOnly: true,
            secure: true
        })
        .json({
            isAuth: true,
        });
};

