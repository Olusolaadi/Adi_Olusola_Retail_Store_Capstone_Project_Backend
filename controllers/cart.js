import User from "../models/User.js";
import Product from "../models/Product.js";

export const fetchCartItems = async (req, res) => {
  try {
    const customer = await User.findById(req.user._id).populate("cart.product");
    res.json(customer.cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cart items cannot be fetched!", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, no } = req.body;
    const customer = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    const productIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );
    if (productIndex > -1) {
      customer.cart[productIndex].no += no; // Adds the item to the cart if it already exists
    } else {
      customer.cart.push({ product: product._id, no });
    }

    await customer.save();
    res.json(customer.cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Item cannot be added to cart!", error: error.message });
  }
};

export const clearFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const customer = await User.findById(req.user._id);

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );

	if (itemIndex !== -1) {
		cartItems.splice(itemIndex, 1); // Removes the item from the cart
		console.log('Product removed from cart.');
	  } else {
		console.log('Product not found in cart.');
	  }

    await customer.save();
    res.json(customer.cart);
  } catch (error) {
    res.status(500).json({
      message: "Item cannot be cleared from cart!",
      error: error.message,
    });
  }
};

/*
		const selectedProducts = await ProductModel.find({ _id: { $in: req.user.cart } });

		// Adjust the quantity of a product.
		const itemsInCart = selectedProducts.map((product) => {
			const cartItem = req.user.cart.find((item) => item.id === product.id);
			return { ...product.toJSON(), quantity: cartItem.quantity };
		});

		response.json(itemsInCart);
	} catch (err) {
		console.log("Cannot adjust quantity", err.message);
		response.status(500).json({ message: "Internal Server Error", error: err.message });
	}
};




	  const user = await User.findById(req.user._id).populate('cart.product');
	  res.json(user.cart);
	} catch (error) {
	  res.status(500).json({ message: "Error fetching cart items", error: error.message });
	}
  };

  const productIndex = cartItems.findIndex((item) => item.id === productId);


export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const currentUser = req.user;

		const currentCartItem = currentUser.cart.find((item) => item.id === productId);
		if (currentCartItem) {
			currentCartItem.quantity += 1;
		} else {
			currentUser.cart.push(productId);
		}

		await currentUser.save();
		res.json(currentUser.cart);
	} catch (err) {
		console.log("Cannot add to cart", err.message);
		response.status(500).json({ message: "Internal Server Error", error: err.message });
	}
};

export const clearCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const currentUser = req.user;
		if (!productId) {
			currentUser.cart = [];
		} else {
			currentUser.cart = currentUser.cart.filter((item) => item.id !== productId);
		}
		await currentUser.save();
		response.json(currentUser.cart);
	} catch (err) {
		response.status(500).json({ message: "Internal Server Error", error: err.message });
	}
};
*/

export const updateCart = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { qty } = req.body;
		const currentUser = req.user;
		const currentCartItem = currentUser.cart.find((item) => item.id === productId);

		if (currentCartItem) {
			if (qty === 0) {
				currentUser.cart = currentUser.cart.filter((item) => item.id !== productId);
				await currentUser.save();
				return res.json(currentUser.cart);
			}

			currentCartItem.qty = qty;
			await currentUser.save();
			res.json(currentUser.cart);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (err) {
		console.log("Cannot update cart.", err.message);
		response.status(500).json({ message: "Internal Server Error", error: err.message });
	}
};

