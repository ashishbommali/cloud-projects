const {INTEGER} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}

const model =engine =>{
    const friendModel =engine.define('friend', schema, {timestamps: false});
    return friendModel;
}

module.exports =model;