if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const { string, date } = require('joi');

const campgroundRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');
const dbUrl =process.env.DB_URL ||'mongodb://localhost:27017/yelp-camp';


mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})
process.on('warning', e => console.warn(e.stack));

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const MongoDBStore = require('connect-mongo');
// const dbUrl = 'mongodb://localhost:27017/yelpCamp'; // || 

const secret = process.env.SECRET || 'supersecret';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error",function(e){
    console.log('Session store error',e);
})
const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    // console.log(req.session);
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use(mongoSanitize());


app.get('/', (req, res) => {
    res.render('home')
})

app.use('/campground', campgroundRoutes);
app.use('/campground/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);



//response to no route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})


//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;

//server start
app.listen(port ,() => {
    console.log(`Listening on port ${port}`)
})