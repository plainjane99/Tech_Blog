const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
    User.findAll({
        // exclude the password column for security
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        ;
});

// get one user with their posts and comments
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        // exclude password column for security
        attributes: { exclude: ['password'] },
        include: [
            // include Post and Comment model 
            {
                model: Post,
                attributes: ['id', 'title', 'post_text', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
        ]
    })
        .then(dbUserData => {
            // if the search brings back nothing
            if (!dbUserData) {
                // send a 404 status to indicate everything is ok but no data found
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // otherwise, send back the data
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        ;
});

// create a new user
router.post('/', (req, res) => {
    // pulls user data that is input into the sign-up form
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            // initiate the creation of the session before we send the response back
            req.session.save(() => {
                // give server access to user's user_id, username, and a boolean of whether user is logged in
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        ;
});

// log-in with user-input data
router.post('/login', (req, res) => {
    // expects {username: '', password: ''}
    // query for a single user
    User.findOne({
        // query by username entered and assign to req.body.username
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        // if username is not found
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!' });
            return;
        }

        // if username is found, verify the user's identity by matching the password
        const validPassword = dbUserData.checkPassword(req.body.password);

        // if password does not match, send back error message and exit 
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        // initiate the creation of the session before we send the response back
        req.session.save(() => {
            // declare session variables
            // give server access to user's user_id, username, and a boolean of whether user is logged in
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            // if there is a match, send message of log in
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// update a user's information
router.put('/:id', withAuth, (req, res) => {
    // expects {username: '', email: '', password: ''}

    // we pass in req.body to provide new data we want to use in the update
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
        ;
});

// delete a user
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// log out route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // send back 204 status after the session has successfully been destroyed
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

module.exports = router;