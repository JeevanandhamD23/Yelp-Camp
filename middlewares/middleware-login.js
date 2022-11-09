
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas')
const ExpressError = require('../utils/ExpressError');

module.exports.isLoggedin = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'log in to continue');
        return res.redirect('/login');
    }
    next();
}

//error catching for other than client request for campground new file
module.exports.validateCampground = function (req, res, next) {

    const { error } = campgroundSchema.validate(req.body);
    // console.log(req.body);
    // console.log(result);
    if (error) {
        const message = error.details.map(mapover => mapover.message).join(',')
        throw new ExpressError(message, 400);
    }
    next();
}
///check for the author of the campground
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Sorry!,You are not allowed to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(mapover => mapover.message).join(',')
        throw new ExpressError(message, 400);
    }
    next();
}

///check for the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry!,You are not allowed to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}