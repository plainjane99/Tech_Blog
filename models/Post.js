// import Model class and DataTypes object from Sequelize to create our models from 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model from the Sequelize constructor
class Post extends Model {}

// initialize the model's data and configuration by passing in two objects as arguments
Post.init(
    // first argument: defines table columns and configuration
    {
        // define an id column 
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // define a title column 
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define a post text column 
        post_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // define a column for the user that created the post through the user model
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    // configure the metadata, including the naming conventions
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;