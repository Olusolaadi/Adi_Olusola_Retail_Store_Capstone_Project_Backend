import Order from "../models/Order.js";
import { stripe } from "../lib/stripe.js";

export const handleCheckout = async (req, res) => {
  try {
    const { items } = req.body;

    //if (!Array.isArray(items) || items.length === 0) {
      //return res.status(400).json({ error: "No items provided" });
   // }

    //let totalCost = 0;

    const checkoutItems = items.map(product => ({
      priceInfo: {
        currency: 'usd',
        productInfo: {
          name: product.name,
          images: [product.image],
        },
        unitCost: product.price * 100,
      },
      no: product.no,
    }));


    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      checkout_items: checkoutItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        customerId: req.user._id.toString(),
        items: JSON.stringify(
          items.map((i) => ({
            id: i._id,
            quantity: i.quantity,
            price: i.price,
          }))
        ),
      },
    });

    res.status(200).json({ id: checkout.id, totalCost: totalCost / 100 });
  } catch (error) {
    console.error("Failed to initiate checkout:", error);
    res
      .status(500)
      .json({ message: "Checkout initiation failed", error: error.message });
  }
};

export const handleCheckoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const sessionDetails = await stripe.checkout.retrieve(sessionId);

    if (sessionDetails.payment_status === "paid") {

      // Extract items data from session metadata and create an order
      const items = JSON.parse(sessionDetails.metadata.items);
      const orderRecord = new Order({
        customer: sessionDetails.metadata.customerId,
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalCost: sessionDetails.cost_total / 100,
        stripeSessionId: sessionId,
      });

      await orderRecord.save();

      res.status(200).json({
        success: true,
        message: "Order created successfully after payment.",
        orderId: orderRecord._id,
      });
    }
  } catch (error) {
    console.error("Error finalizing checkout:", error);
    res
      .status(500)
      .json({ message: "Checkout finalization failed", error: error.message });
  }
};
