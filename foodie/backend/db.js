const mongoose = require('mongoose');
const mongoURI = 'mongodb://gofood:gofood123@ac-ljdpjhh-shard-00-00.zam6ddk.mongodb.net:27017,ac-ljdpjhh-shard-00-01.zam6ddk.mongodb.net:27017,ac-ljdpjhh-shard-00-02.zam6ddk.mongodb.net:27017/gofoodmern?ssl=true&replicaSet=atlas-13adux-shard-0&authSource=admin&retryWrites=true&w=majority'

const mongoDB = async () => {
  await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
  if (err) console.log("---", err)
  else {
    console.log("connected");
    const fetched_data = await mongoose.connection.db.collection("food_items");
    fetched_data.find({}).toArray(async function (err, data) {

      const foodCategory = await mongoose.connection.db.collection("foodCategory");
      foodCategory.find({}).toArray(function (err, catData) {
        if (err) console.log(err);
        else {
          global.food_items = data;
          global.foodCategory = catData;
        }
      })
      // if (err) console.log(err);
      // else {
      //   global.food_items = data;

      // }
    })
  }
});
};

module.exports = mongoDB;
