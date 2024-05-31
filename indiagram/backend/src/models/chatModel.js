const {INTEGER} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
}

const model =engine =>{
    const chatModel =engine.define('chat', schema, {timestamps: false});
    chatModel.associate =models =>{
        chatModel.hasMany(models.message, {foreignKey: 'chat_id'});
    }
    return chatModel;
}

module.exports =model;