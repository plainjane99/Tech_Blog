const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// a user can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// a post belongs to a single user
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// a comment belongs to a single user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// a comment belongs to a single post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// a user can have many comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// a post can have many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };