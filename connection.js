const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const databaseName = "10mins";
const client = new MongoClient(url);

// async function getData()
// {
//     let result = await client.connect();
//     console.log('result: ', result);
//     db= result.db(databaseName);

//     // collection = db.collection('products');
//     // let data = await collection.find({}).toArray();
//     // console.log(data)

// }

// getData();
// mongoose.connect(`mongodb+srv://needup:Kg0KqPVxI0Tw9rM4@needup.ckfmxwz.mongodb.net/need_up?retryWrites=true&w=majority`, ()=> {
//   console.log('connected to mongodb')
// })
// mongoose.connect(`mongodb://localhost:27017/Needup';`, () => {
//   console.log('connected to mongodb')
// })

// mongoose.connect("mongodb://localhost:27017/Needup", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// useCreateIndex: true
// }).then(() => {
//   console.log(`successfully connected`);
// }).catch((e) => {
//   console.log(`not connected`)
// })

mongoose
  .connect("mongodb://0.0.0.0:27017/10mins", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`successfully connected`);
  })
  .catch((e) => {
    console.log("e: ", e);
    console.log(`Not Connected`);
  });
