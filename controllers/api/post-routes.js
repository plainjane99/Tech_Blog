const router = require('express').Router();
// destructure User, Post and Vote from the imported models
const { Post, User, Comment } = require('../../models');
// import connection to Sequelize 
// const sequelize = require('../../config/connection');
// import the authguard function
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'post_text', 'created_at'],
        // return the posts in descending order by the 'created_at' property
        order: [['created_at', 'DESC']],
        // include username and post comments
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                // also needs to include the user model so it can attach the username to the comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

// single post query
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        // requesting these attributes
        attributes: ['id', 'post_text', 'title', 'created_at'],
        // include username and post comments
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                // also needs to include the user model so it can attach the username to the comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a post
router.post('/', withAuth, (req, res) => {
    // expects {title: '', post_text: '', user_id: 1}
    Post.create({
        // pulls data from form 
        title: req.body.title,
        post_text: req.body.post_text,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// update an existing post
// first retrieve the post instance by id then alter the value of the title
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            // takes in all data and replaces the title and/or text of the post
            title: req.body.title,
            post_text: req.body.post_text
        },
        {
            // use the request parameter to find the post
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // send back data that has been modified and stored in database
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // return the resultant
            res.json(dbPostData);
            console.log(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;