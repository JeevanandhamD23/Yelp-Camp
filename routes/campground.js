const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas')
const { isLoggedin, validateCampground, isAuthor } = require('../middlewares/middleware-login');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });


//fancier method to write code in router.route
router.route('/')
    //campground listing everything

    .get(catchAsync(campgrounds.index))
    //new product add and redirect to its show page
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


//campground listing everything


//route for form - to add new campground
router.get('/new', isLoggedin, campgrounds.renderNewForm);





//fancier method to write code in router.route for id
router.route('/:id')
    //campground show particular one
    .get(catchAsync(campgrounds.show))
    //put request to campground to update
    .put(isLoggedin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    //delete campground
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampground));




//rendering to edit form page
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgrounds.renderEditForm));




module.exports = router;