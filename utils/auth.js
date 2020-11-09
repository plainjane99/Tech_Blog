// middleware function to authguard routes
const withAuth = (req, res, next) => {
    // check for the existence of a session property
    if (!req.session.user_id) {
        // use res.redirect if session is not there
        res.redirect('/login');
    // if session does exist
    } else {
        // next calls the next middleware function, passing along the same req and res values
        next();
    }
};

module.exports = withAuth;