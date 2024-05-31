
const {INTEGER, STRING, DATE, NOW, BOOLEAN} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    body: {
        type: STRING, allowNull: false,
    },
    type: {
        type: STRING(24), allowNull: false, // flash, consistent
    },
    is_viewed: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    sent_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
    },
}

const model =engine =>{
    const notificationModel =engine.define('notification', schema, {timestamps: false});
    notificationModel.associate =models =>{
        notificationModel.belongsTo(models.user,  {foreignKey: 'user_id'});
    }
    return notificationModel;
}

module.exports =model;