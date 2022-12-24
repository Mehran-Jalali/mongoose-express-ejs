const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const AppError = require("./AppError.js");

mongoose.set("strictQuery", true);
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

// wrapAsync Function ==> For Error Handling ----------------------------------------------------------
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}
//--------------------------------------------------------------------------------------------------------

const categories = ["fruit", "vegetable", "dairy", "fungus"];

//-----------------Showing products------------------
app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category });
      res.render("products/index", { products, category, categories });
    } else {
      const products = await Product.find({});
      res.render("products/index", { products, category: "All", categories });
    }
  })
);

//-----------------Adding new product------------------
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

// <♥▬♥>
app.post(
  "/products",
  wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect("/products");
  })
);
// <♥▬♥>
//-----------------Showing datails------------------
app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(`product not found`, 404);
    }
    res.render("products/show", { product });
  })
);

//-----------------Updating/Editing products------------------
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return next(new AppError(`product not found`, 404));
    }
    res.render("products/edit", { product, categories });
  })
);
app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);
//-----------------Deleting products------------------
app.delete(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
  })
);

const handleValidationErr = (err) => {
  console.dir(err);
  return new AppError(`Validation Failed...${err.message}`, 400);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") err = handleValidationErr(err);
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = `Something went wrong` } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log(`Listening On Port 3000`);
});
