import express from "express";
import Order from "../models/Order.js";
import twilio from "twilio";
const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/", async (req, res) => {
  const { user, products, total, customerInfo } = req.body;
  
  const mappedProducts = products.map(p => ({
    productId: p._id,
    name: p.name,
    price: p.price,
    quantity: p.quantity,
    image: p.images ? p.images[0] : ""
  }));

  const order = await Order.create({ user, products: mappedProducts, total, customerInfo });

  try {
    const msg = `New Order:
Customer: ${customerInfo.name}, ${customerInfo.phone}, ${customerInfo.email}
Products: ${products.map(p => `${p.name} x${p.quantity}`).join(", ")}
Total: ${total}
Address: ${customerInfo.address}`;

    await client.messages.create({
      body: msg,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`,
    });
  } catch (err) {
    console.error("Twilio error:", err.message);
  }

  res.json(order);
});

export default router;
