const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
async function main(){
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
const initdb = async () =>{
   await Listing.deleteMany({});
  initdata.data=initdata.data.map((obj)=>({...obj , owner: "67855f8077cffbc14df5e6d4" }))
   await Listing.insertMany(initdata.data);
   console.log("data was initlize")


}
initdb();