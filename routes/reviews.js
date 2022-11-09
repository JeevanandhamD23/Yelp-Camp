const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { reviewSchema } = require('../schemas');
const { isLoggedin, validateReview, isReviewAuthor } = require('../middlewares/middleware-login');
const reviews = require('../controllers/reviews');

const Review = require('../models/review');


//error catching for other than client request for review 


//adding review route
router.post('/', isLoggedin, validateReview, catchAsync(reviews.newReview));

// //adding review route
// router.get('/', isLoggedin, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     req.flash('success', 'succesfully logged in');
//     res.redirect(`/campground/${id}`)
// }))


//deleting review
router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;