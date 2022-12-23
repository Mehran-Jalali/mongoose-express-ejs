const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Mongo connection open!!`);
  })
  .catch((err) => {
    console.log("Mongo connection ERROR!!");
    console.log(err);
  });

// const p = new Product({
//   name: "Pomegranate",
//   price: 2,
//   category: "Fruit",
// });
// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Instead of inserting one product like above we're gonna insert many of them in much quicker time:
const seedProducts = [
  {
    name: "Fairy Eggplanet",
    price: 1.0,
    category: "vegetable",
  },
  {
    name: "organic Melon",
    price: 4.19,
    category: "fruit",
  },
  { name: "organic Watermelon", price: 3.99, category: "fruit" },
  {
    name: "organic Celery",
    price: 1.3,
    category: "vegetable",
  },
  {
    name: "coconut Milk",
    price: 2.12,
    category: "dairy",
  },
];

Product.insertMany(seedProducts)
  .then((p) => {
    console.log(p);
  })
  .catch((err) => {
    console.log(err);
  });
