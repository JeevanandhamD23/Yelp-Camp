const User = require('../models/user');

//register form for new user

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}


//post route to register form to include new user in db

module.exports.createNewUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username: username, email: email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp-camp');
            res.redirect('campground');
        })

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}

//login page for existing user

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

//login with passport authenticate

module.exports.login = (req, res) => {

    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}

//logout 

module.exports.logout = (req, res) => {
    req.logOut(function (err) {
        if (err) return next(err);
        req.flash('success', 'Logeed out successfully');
        res.redirect('/campground');
    });

}