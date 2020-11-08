// This file will contain all of the user-facing routes, such as the homepage and login page.
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

const router = require('express').Router();

// this route displays all of the posts
router.get('/', (req, res) => {
    // show the session variables
    // console.log(req.session);

    Post.findAll({
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // loop over and map each Sequelize object  
            // serialize the object down to only the properties we need using get()
            // save the results in a new posts array
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // add new posts array into an object to be passed into the homepage template
            // the object allows us to add properties in the future
            // res.render('homepage', { posts, loggedIn: req.session.loggedIn });
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// route to display log-in
router.get('/login', (req, res) => {
    // check for a session and redirect to the homepage if one exists
    // if (req.session.loggedIn) {
    //     res.redirect('/');
    //     return;
    // }
    // log in page doesn't need any variables so we don't need to pass in a second argument
    res.render('login');
});

// route for single post
router.get('/post/:id', (req, res) => {

    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            // pass a session variable to the template
            res.render('single-post', { post, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;