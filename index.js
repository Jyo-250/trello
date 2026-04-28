const express = require("express");
const users = [{
    id: 1,
    username: "jyothsna",
    password: "123123" 
}, {
    id: 2,
    username: "venkat",
    password: "123123" 
},{
    id: 3,
    username: "sarvesh",
    password: "123123" 
},{
    id: 4,
    username: "suma",
    password: "123123" 
}];
const organizations = [{
    id: 1,
    title: "amazon",
    description: "An ecommerce website",
    admin: 1,
    members: [2]
}, {
    id: 2,
    title: "a2z",
    description: "A coding platform",
    admin: 2,
    members: []
}];
const boards = [{
    id: 1,
    title: "Amazon prime",
    organizationId: 1
}];
const issues = [{
    id: 1,
    title: "Add dark mode",
    boardId: 1
}, {
    id: 2,
    title: "Allow admins to add more content",
    boardId: 1
}];

const app = express();
app.listen(3000);