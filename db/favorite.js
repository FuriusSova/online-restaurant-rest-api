const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    dishId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish' 
    }
}, {
    timestamps: false
});

const infoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favourites:[favouriteSchema]
}, {
    timestamps: true
});

let Favorites = mongoose.model('Favorites', infoSchema);

module.exports = Favorites;