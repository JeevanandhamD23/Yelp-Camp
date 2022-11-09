const mongoose = require('mongoose');
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}
const dm = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '63400dc61afd23fff18e728c',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla non illo pariatur praesentium cum nobis nam modi repellat inventore ex, mollitia necessitatibus consequatur magni itaque at. Tempora quasi molestias ipsum?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [
                {

                    url:
                        "https://res.cloudinary.com/dlpb18qoc/image/upload/v1665506631/YelpCamp/xziftdn7lcdvnqrdrpud.jpg",
                    filename:
                        "YelpCamp/xziftdn7lcdvnqrdrpud"
                },
                {
                    url: 'https://res.cloudinary.com/dlpb18qoc/image/upload/v1665419104/YelpCamp/z8qbpzckjeg9dy9aqaaq.jpg',
                    filename: 'YelpCamp/eunislwpani2df81atlz'
                }

            ]
        })
        await c.save();
    }


}
dm();
