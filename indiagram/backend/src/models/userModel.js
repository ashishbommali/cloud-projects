const {INTEGER, STRING, TEXT} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: STRING(64), allowNull: false,
    },

    email: {
        type: STRING(32), allowNull: false,
        unique: true,
        validate: { isEmail: true, }
    },

    password: {
        type: STRING, allowNull: false
    },

    profile_photo: {
        type: TEXT, allowNull: true,
    },
}

const model =engine =>{
    const userModel =engine.define('user', schema, {timestamps: false});
    userModel.associate =models =>{
        userModel.hasMany(models.post, {foreignKey: 'author_id'});
        userModel.hasMany(models.comment, {as: 'author', foreignKey: 'author_id'});
        userModel.hasMany(models.like, {foreignKey: 'user_id'});
        userModel.belongsToMany(userModel, {
            as: 'friendsList', 
            through: models.friend,
            foreignKey: 'user_id', otherKey: 'friend_id',
        });

        userModel.belongsToMany(userModel, {
            as: 'conversation',
            through: models.chat,
            foreignKey: 'party_a', otherKey: 'party_b',
        });

        userModel.belongsToMany(userModel, {
            as: 'messaging', 
            through: models.message,
            foreignKey: 'sender', otherKey: 'receiver',
        });

        userModel.belongsToMany(userModel, {
            as: 'requests_sent', 
            through: models.friend_request,
            foreignKey: 'to', otherKey: 'by',
        });

        userModel.belongsToMany(userModel, {
            as: 'requests_received', 
            through: models.friend_request,
            foreignKey: 'by', otherKey: 'to',
        });

        userModel.hasMany(models.notification, {foreignKey: 'user_id'});
        userModel.hasMany(models.group, {as: 'creator', foreignKey: 'creator_id'});
        userModel.belongsToMany(models.group, {as: 'groupsJoined', through: models.group_members, foreignKey: 'member_id'});
    }

    return userModel;
}


module.exports =model;