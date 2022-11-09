const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

//campground listing everything
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds })
}

//route for form - to add new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campground/new')
}

//campground show particular one
module.exports.show = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate
        ({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    // console.log(campground);
    // console.log(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campground');
    }
    res.render('campground/show', { campground });
}

//new product add and redirect to its show page//create route
module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground data', 400);

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features[0]);

    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.author = req.user._id;
    await campground.save()
    // console.log(req.files);
    // console.log(campground)
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`campground/${campground._id}`);
}

//rendering to edit form page
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    // console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campground');
    }
    res.render('campground/edit', { campground })
}

//put request to campground to update
module.exports.updateCampground = async (req, res) => {

    const { id } = req.params;
    // console.log(id);
    // console.log(req.body.campground)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    // res.redirect(`campground/${campground._id}`)
    // console.log(campground._id)
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.image.push(...images);
    await campground.save();
    // console.log(req.body);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            //preavailed function in cloudinary to remove files
            await cloudinary.uploader.destroy(filename);
        }
        //remove from our database
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campground/${campground._id}`);
}

//for deleting campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const delcampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${delcampground.title} campground`);
    res.redirect('/campground')
}