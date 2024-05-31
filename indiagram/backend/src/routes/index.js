const fs=require('fs');
const path=require('path');

const routes={};

// require models
fs.readdirSync(__dirname)
.filter(file=>file.indexOf('.') >0 && /^[a-bA-Z]+route\.js$/gi.test(file))
.forEach(file =>{
    const route =require(path.join(__dirname, file));
    routes[route.name] =route.router;
});

module.exports =routes;