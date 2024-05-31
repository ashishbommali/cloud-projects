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
    const commentModel =engine.define('comment', schema, {timestamps: false});
    commentModel.associate =models =>{
        commentModel.belongsTo(models.user,  {as: 'author', foreignKey: 'author_id'});
        commentModel.belongsTo(models.post, {foreignKey: 'post_id'});
    }
    return commentModel;
}

module.exports =model;