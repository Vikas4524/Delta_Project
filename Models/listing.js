 const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

 const listingSchema = new Schema(
    {
        title : {
            type : String,
            required : true,
        },
        description : {
            type : String,
        },

        image : {
            // type : String,
            
            // default : "https://images.unsplash.com/photo-1692627806647-2ca49614fa44?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            // set : (v) => 
            //     v === "" ? "https://images.unsplash.com/photo-1613575831056-0acd5da8f085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8" : v,
                            //    cloudenamy
            url : String,
            filename : String,
        },
        price : {
            type : Number,
        },
        location : {
          type : String,  
        },
        country : {
            type : String,
        },

        reviews : [
            {
                 type : Schema.Types.ObjectId , ref : "review"
                },
        ],
        
        owner : {
            type : Schema.Types.ObjectId, ref : "User",
        },
        geometry: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
              },
              coordinates: {
                type: [Number],
                required: true
              }
        }
    }
);

listingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing =  mongoose.model("Listing", listingSchema);

module.exports = Listing;
