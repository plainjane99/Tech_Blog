// import Model class and DataTypes object from Sequelize to create our models from 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Comment model from the Sequelize constructor
class Comment extends Model { }

// initialize the model's data and configuration by passing in two objects as arguments
Comment.init(
    {
        // define an id column 
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // define a comment column 
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        // define a column for the user that created the comment through the user model
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // define a column for the post being commented on through the post model
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post',
                key: 'id'
            }
        }
    },
    // configure the metadata, including the naming conventions
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment'
    }
);

module.exports = Comment;