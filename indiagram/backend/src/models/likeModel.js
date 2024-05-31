const {INTEGER,  DATE, NOW, TEXT} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
    liked_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
    },
}

const model =engine =>{
    const likeModel =engine.define('like', schema, {timestamps: false});
    likeModel.associate =models =>{
        likeModel.belongsTo(models.user, {foreignKey: 'user_id'});
        likeModel.belongsTo(models.post, {foreignKey: 'post_id'});
    }
    return likeModel;
}

module.exports =model;