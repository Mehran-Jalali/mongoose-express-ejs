const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const AppError = require("./AppError");

//=========for Path & put route==============
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//============================================

//Now we're gonna require/import our 'Product' model from ./models/product.js
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// <♥▬♥>
app.use(express.urlencoded({ extended: true }));
// <♥▬♥>

const categories = ["fruit", "vegetable", "dairy", "fungus"];

//-----------------Showing products------------------
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category, categories });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All", categories });
  }
});

//-----------------Adding new product------------------
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

// <♥▬♥>
app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.redirect("/products");
});
// <♥▬♥>
//-----------------Showing datails------------------
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

//-----------------Updating/Editing products------------------
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});
//-----------------Deleting products------------------
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
});

app.listen(3000, () => {
  console.log(`Listening On Port 3000`);
});
