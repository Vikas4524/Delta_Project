const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },

    createdAt : {
        type : Date,
        default : Date.now(),
    },
                    // setting Authorization
    author : {
        type : Schema.Types.ObjectId, ref : "User",
    }

});

const review = mongoose.model("review", reviewSchema);


module.exports = review;