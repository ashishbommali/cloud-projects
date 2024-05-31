const { DataTypes } =require('sequelize');

const NOW =DataTypes.NOW;
const TEXT =DataTypes.TEXT;
const DATE =DataTypes.DATE;
const STRING =DataTypes.STRING;
const INTEGER =DataTypes.INTEGER;
const BOOLEAN =DataTypes.BOOLEAN;

module.exports ={
    STRING, INTEGER, NOW, DATE,
    TEXT, BOOLEAN
};