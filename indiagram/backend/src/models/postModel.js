const {INTEGER,  DATE, NOW, TEXT, STRING} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    body: {
        type: TEXT, allowNull: true,
    },
    
    posted_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
    },
}

const model =engine =>{
    const postModel =engine.define('post', schema, {timestamps: false});
    postModel.associate =models =>{
        postModel.hasMany(models.like, {as: 'likes', foreignKey: 'post_id'});
        postModel.hasMany(models.comment, {as: 'comments', foreignKey: 'post_id'});
        postModel.hasMany(models.attatchment, {as: 'attatchment', foreignKey: 'post_id'});
        postModel.belongsTo(models.user, {as: 'author', foreignKey: 'author_id'});
    }
    return postModel;
}

module.exports =model;