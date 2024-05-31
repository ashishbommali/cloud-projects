const {INTEGER, TEXT} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
    url: {
        type: TEXT, allowNull: false,
    }
}

const model =engine =>{
    const attatchmentModel =engine.define('attatchment', schema, {timestamps: false});
    attatchmentModel.associate =models =>{
        attatchmentModel.belongsTo(models.post, {foreignKey: 'post_id'});
    }
    return attatchmentModel;
}

module.exports =model;