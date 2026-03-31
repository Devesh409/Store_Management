import Product from "../Models/productModal.js";
import User from "../Models/userModel.js";

export const getProductsController = async (req, res) => {
  try {
    // Get user and populate products
    const user = await User.findById(req.user.userId).populate("products");
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Unauthorized user" });
    }
    return res.status(200).json({ status: true, data: user.products });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to fetch products!",
      error: error.message,
    });
  }
};

export const insertProductController = async (req, res) => {
  const { p_name, p_price, p_stock } = req.body;
  console.log(req.body);
  try {
    if (!p_name || !p_price || !p_stock) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required product fields!" });
    }

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Unauthorized user" });
    }

    // Create and save the product
    const product = await Product.create({
      p_name,
      p_price,
      p_stock,
      userId: req.user.userId,
    });
    user.products.push(product._id);
    await user.save();

    return res
      .status(201)
      .json({ status: true, message: "Product inserted", data: product });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to insert product!",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  const { productId, newdata } = req.body;

  try {
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "Product ID is required!" });
    }

    if (!newdata || typeof newdata !== "object") {
      return res
        .status(400)
        .json({ status: false, message: "Update data is required!" });
    }

    // ensure user can only update own products
    const product = await Product.findOne({ _id: productId, userId: req.user.userId });
    if (!product) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found or not permitted!" });
    }

    const allowedUpdates = ["p_name", "p_price", "p_stock", "p_thumbnail"];
    const updates = {};
    Object.keys(newdata).forEach((key) => {
      if (allowedUpdates.includes(key)) updates[key] = newdata[key];
    });

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No valid fields to update!" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ status: true, message: "Product updated", data: updatedProduct });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update product!",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  const { productId } = req.body;

  try {
    if (!productId) {
      return res
        .status(400)
        .json({ status: false, message: "Product ID is required!" });
    }

    // Get user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Unauthorized user" });
    }

    // Delete product from database
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found!" });
    }

    // Remove product from user’s products array
    user.products = user.products.filter((id) => id.toString() !== productId);
    await user.save();

    return res.status(200).json({ status: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete product!",
      error: error.message,
    });
  }
};
