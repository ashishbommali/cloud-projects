const {INTEGER,  DATE, NOW, TEXT} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    body: {
        type: TEXT, allowNull: false,
    },
    posted_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
    },
}

const model =engine =>{
    const messageModel =engine.define('message', schema, {timestamps: false});
    messageModel.associate =models =>{
        messageModel.belongsTo(models.chat, {foreignKey: 'chat_id'});
    }
    return messageModel;
}

module.exports =model;