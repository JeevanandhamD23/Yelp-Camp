
# Yelp-Camp

A Camping site where users can share their opinions on certain campgrounds and list their campgrounds sites .
It also have locations where users can track their liked campgrounds.

# Features

Users can create, edit, and remove campgrounds
Users can review campgrounds once, and edit or remove their review
User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
Search campground by name or location
Sort campgrounds by highest rating, most reviewed, lowest price, or highest price
# Run it locally

```bash
Install mongodb

Create a cloudinary account to get an API key and secret code
git clone https://github.com/himanshup/yelpcamp.git

```bash
cd yelpcamp
npm install

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
Run mongod in another terminal and node app.js in the terminal with the project.

Then go to localhost:3000.

To get google maps working check this out.

## Acknowledgements

 - [Node.js](https://nodejs.org/en/docs/)
 - [MongoDB](https://www.mongodb.com/docs/)


## Appendix

Knowledge on node and mongo DB is important.


## Contributing

This project is Contributing for users to know their places and their surroundings


## Deployment

To deploy this project run

```bash
  npm install
```
Then if it's app.js main file

```bash
  node app.js


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY` = MongoDB

`ANOTHER_API_KEY` = MOngoDB user key

`SECRET_KEY` = self SECRET_KEY 


## Demo

Working model

Link - (https://enigmatic-sands-99074.herokuapp.com/campground)

## Tech Stack

 Node, Express, Javascript, Html, CSS, Ejs template, MongDB, passport

