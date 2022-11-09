const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');


const User = require('../models/user');
const users = require('../controllers/users');
const { route } = require('./campground');
const user = require('../models/user');


//fancy way of writing code 
router.route('/register')

    //register form for new user
    .get(users.renderRegisterForm)

    //post route to register form to include new user in db
    .post(catchAsync(users.createNewUser));

router.route('/login')
    //login page for existing user
    .get(users.renderLoginForm)

    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),
        users.login)

router.get('/logout', users.logout);

module.exports = router;