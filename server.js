// import express to create our server
const express = require('express');
// import all routes for use in server.js
const routes = require('./controllers');
// import connection to Sequelize 
const sequelize = require('./config/connection');
// import path module to provide utilities for working with file and directory paths
const path = require('path');
// set up handebars.js
const exphbs = require('express-handlebars');
// creates sessions
const session = require('express-session');
// stores express-session sessions into our database
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// import helpers
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

// set up handlebars
const hbs = exphbs.create({ helpers });

// set us sessions and connects the session to our Sequelize database
const sess = {
    // secret property holds secret data and stored in .env file
    secret: 'ilikechocolatechipcookiesbetterthanoatmeal',
    // {} tells our session to use cookies
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

// sets up handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// middle-ware functions
// parses incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve up all files in 'public' as static assets 
app.use(express.static(path.join(__dirname, 'public')));

// set up sessions
app.use(session(sess));
// turn on routes
app.use(routes);

// establish the connection to the server and database 
// force: false prevents the drop and re-create of the database tables at start-up
// force: true makes the tables re-create if there are any association changes
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});