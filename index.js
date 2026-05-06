const express = require("express");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require('./middleware');
const { userModel, organizationModel} = require('./models');

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
app.post("/signup",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
    });
    if(userExists){
        return res.status(403).json({
            message : "User with this username already exists"
        })
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id,
        message: "You have signed up successfully"
    })
})

//signin
app.post("/signin",async(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
        password: password
    });
    
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

app.post("/organization", authMiddleware, async(req,res)=>{
    const userId = req.userId;
    
    const organization = await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: organization._id
    })
})

app.post("/add-member-to-organization",authMiddleware, async(req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserName = req.body.memberUserName;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser = await userModel.findOne({
        username: memberUserName
    })

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return;
    }

    organization.members.push(memberUser._id)
    await organization.save()

    res.json({
        message: "A member added!"
    })
})

app.post("/board",(req,res)=>{
    
})

app.post("/issue",(req,res)=>{
    
})


//READ
app.get("/organization",authMiddleware, async(req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesnot exist or you are not an admin of this org"
        })
        return;
    }

    res.json({
        organization: organization
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
app.delete("/members",authMiddleware, async(req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserName = req.body.memberUserName;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if(!organization || organization.admin.toString() !== userId){
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return;
    }

    const memberUser = await userModel.findOne({
        username: memberUserName
    })

    if(!memberUser){
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return;
    }

    organization.members = organization.members.filter(x => x.toString()!== memberUser._id.toString());
    await organization.save();

    res.json({
        message: "Member removed!"
    })
})
app.listen(3000);