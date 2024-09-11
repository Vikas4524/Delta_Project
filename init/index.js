const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");


main()
.then((res)=>{
    console.log("connection working");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');    
};


const initDB = async ()=>{
    await Listing.deleteMany({});

                    // Owner app of data
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : '66cd88afe1b44157cbe74389',
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();     

