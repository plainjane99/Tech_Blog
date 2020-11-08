const router = require('express').Router();
const { Comment } = require('../../models');
// import the authguard function
// const withAuth = require('../../utils/auth');

// write all comment routes when you get back from dinner.  this have not been touched.
router.get('/', (req, res) => {
    Comment.findAll({
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

});

router.post('/', (req, res) => {
    // check the session
    // ensures that only logged-in users interact with the database
    // if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            // use the id from the session
            // user_id: req.session.user_id
            user_id: req.body.user_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    // }
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            // return the resulting
            res.json(dbPostData);
            console.log(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router;