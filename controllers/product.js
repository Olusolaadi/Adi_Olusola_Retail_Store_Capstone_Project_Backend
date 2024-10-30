import Product from "../models/Product.js";
// import cloudinary from "../lib/cloudinary.js";

// Get all products
export  const fetchAllProducts = async (req, res) => {
	try {
	  const products = await Product.find();

	  res.json(products);
	} catch (error) {
	  res.status(500).json({ message: "Products cannot be fetched.", error: error.message });
	}
  };

  // Get a single product by ID
  export const fetchProductById = async (req, res) => {
	try {
	  const product = await Product.findById(req.params.id);
	  res.json(product);
	} catch (error) {
		res.status(500).json({ message: "Product not found..", error: error.message });
	}
  };

  // Get products by category
  export const fetchProductsByCategory = async (req, res) => {
	try {
	  const products = await Product.find({ category: req.params.category });
	  res.json(products);
	} catch (error) {
		res.status(500).json({ message: "Products not found.", error: error.message });
	}
	};

  // Create a new product
  export const createProduct = async (req, res) => {
	try {
	  const { title, description, price, image, category } = req.body;
	  const product = await Product.create({
		title,
		description,
		price,
		image,
		category,
	  });
	  res.status(201).json(product);
	  console.log(product);
	} catch (error) {
	  res.status(500).json({ message: "Product cannot be created.", error: error.message });
	}
};

// Update a product
export const updateProduct = async (req, res) => {
	try {
		const { title, description, price, image, category } = req.body;
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			{ title, description, price, image, category },
			{ new: true });
			console.log(product);
			res.status(201).json(product);
	} catch (error) {
	  res.status(500).json({ message: "Product cannot be updated.", error: error.message });
	}
};

// Delete a product
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Product cannot be deleted.", error: error.message });
	}
};



       


