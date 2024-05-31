const {INTEGER, STRING, DATE, NOW,} =require('../utils/types.js');

const schema ={
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    name: {
        type: STRING, 
        allowNull: false,
    },
    created_at: {
        type: DATE,
        defaultValue: NOW,
        allowNull: false,
    },
}

const model =engine =>{
    const groupModel =engine.define('group', schema, {timestamps: false});
    groupModel.associate =models =>{
        groupModel.belongsTo(models.user,  {as: 'creator', foreignKey: 'creator_id'});
        groupModel.belongsToMany(models.user, {through: models.group_members, foreignKey: 'group_id'});

    }
    return groupModel;
}

module.exports =model;