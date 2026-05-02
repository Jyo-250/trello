const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require('./middleware')

let USER_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;
const USERS = [];
const ORGANIZATIONS = [];
const BOARDS = [{
    id: 1,
    title: "Amazon prime",
    organizationId: 1
}];
const ISSUES = [{
    id: 1,
    title: "Add dark mode",
    boardId: 1
}, {
    id: 2,
    title: "Allow admins to add more content",
    boardId: 1
}];

const app = express();
app.use(express.json());

//CREATE
app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userExists = USERS.find(user => user.username == username)
    if(userExists){
        return res.status(403).json({
            message : "User with this username already exists"
        })
    }
    USERS.push({
        username: username,
        password: password,
        id: USER_ID++
    })
    res.json({
        message: "You have signed up successfully"
    })
})

//signin
app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    const userExists = USERS.find(user => user.username == username && user.password ===password)
    
    if(!userExists){
        res.status(403).json({
            message : "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId : userExists.id
    }, "jyothsna123");

    res.json({
        token: token
    })
})

app.post("/organization", authMiddleware, (req,res)=>{
    const userId = req.userId;
    ORGANIZATIONS.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: ORGANIZATION_ID-1
    })
})

app.post("/add-member-to-organization",authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUserName = req.body.memberUserUserName;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser = USERS.find(u => u.username === memberUserUserName);

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return;
    }

    organization.members.push(memberUser.id);

    res.json({
        message: "A member added!"
    })
})

app.post("/board",(req,res)=>{
    
})

app.post("/issue",(req,res)=>{
    
})


//READ
app.get("/organization",authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId);

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return;
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})

app.get("/boards",(req,res)=>{
    
})

app.get("/issues",(req,res)=>{
    
})

app.get("/members",(req,res)=>{
    
})

//UPDATE
app.put("/issues",(req,res)=>{
    
})

//DELETE
app.delete("/members",authMiddleware, (req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUserName = req.body.memberUserUserName;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if(!organization || organization.admin !== userId){
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser = USERS.find(u => u.username === memberUserUserName);

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return;
    }

    organization.members = organization.members.filter(id => id !== memberUser.id);

    res.json({
        message: "Member removed!"
    })
})
app.listen(3000);