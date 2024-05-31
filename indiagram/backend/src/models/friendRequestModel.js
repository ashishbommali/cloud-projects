const { STATUS } =require('../utils/constants.js');
const { INTEGER, STRING, DATE, NOW} =require('../utils/types.js');
const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    status: {
        type: STRING, // pending, accepted, rejected
        defaultValue: STATUS.PENDING,
    },

    sent_at:{
        type: DATE,
        defaultValue: NOW,
    }
}

const model =engine =>{
    const friendModel =engine.define('friend_request', schema, {timestamps: false});
    return friendModel;
}

module.exports =model;