const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const router = express.Router();
const tokenAuth = require("../middleware/tokenAuth")
const User = require("../models");

const JWT_SECRET = process.env.JWT_SECRET;

//user register route
router.post("/submit", ({ body }, res) => {
    const user = new User(body);
    user.setFullName();
    user.lastUpdatedDate();
    user.save();

    User.create(user)
        .then(dbUser => {
            res.json(dbUser);
        })
        .catch(err => {
            res.json(err);
        });
});

//user login route
router.post("/login", async (request, response) => {
    try {
        var user = await User.findOne({ username: request.body.username }).exec();
        if(!user) {
            return response.status(400).send({ message: "The username does not exist" });
        }
        user.comparePassword(request.body.password, (error, match) => {
            if(!match) {
                return response.status(400).send({ message: "The password is invalid" });
            }
        });
        // console.log(user._id)
        const token = jwt.sign({
            username: user.username,
            id: user._id
        },
        
            process.env.JWT_SECRET
        
        ,{
            expiresIn: "2h"});
        response.json({
            token: token,
            user: user.username,
            message: "The username and password combination is correct!"
        })
        // response.send({ message: "The username and password combination is correct!" })
        
    } catch (error) {
        console.log(error);
        response.status(500).send(error);
    }
});

router.get("/profile", tokenAuth, (req,res) => {
    res.send(`Welcome to your ZooSchool profile ${req.user.username}`)
    // if(req.headers.authorization){
    //     console.log(req.headers);
    //     // res.send("headers exist")
    //     const token = req.headers.authorization.split(" ").pop();
    //     console.log(token);
    //     jwt.verify(token, process.env.JWT_SECRET, function(err,data){
    //         if(err){
    //             console.log(err);
    //             return res.status(403).send("invalid token")
    //         } else {
    //             console.log("success");
    //             return res.send(`Welcome ${data.username}`)
    //         }
    //     })
    // } else {
    //     return res.status(403).send("include your token")
    // }
})

router.get("/zooschool", tokenAuth, (req,res) => {
    res.send(`Welcome to the game ${req.user.username}`)
    
})


module.exports = router;