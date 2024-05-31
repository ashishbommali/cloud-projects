const fs=require('fs');
const path=require('path');
const sequelize =require('../conf/db.js');

const db={};

// require models
fs.readdirSync(__dirname)
.filter(file=>file.indexOf('.') >0 && /^[a-bA-Z]+model\.js$/gi.test(file))
.forEach(file =>{
    const model =require(path.join(__dirname, file))(sequelize);
    db[model.name] =model;
});

Object.keys(db).forEach(key =>db[key]?.associate? db[key].associate(db): null);
db.sequelize =sequelize;

module.exports =db;