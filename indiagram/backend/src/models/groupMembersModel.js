const {INTEGER, DATE, NOW} =require('../utils/types.js');

const schema ={
    id: {
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
    },
    
    joined_at: {
        type: DATE,
        defaultValue: NOW,
    }
}

const model =engine =>{
    const groupMembersModel =engine.define('group_members', schema, {timestamps: false});
    groupMembersModel.associate =models =>{
        groupMembersModel.belongsTo(models.user, { foreignKey: 'member_id' });
        groupMembersModel.belongsTo(models.group, { foreignKey: 'group_id' });
    }
    return groupMembersModel;
}

module.exports =model;