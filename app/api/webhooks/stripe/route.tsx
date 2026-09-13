import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { sendPurchaseReceipt } from "@/emails";
import Order from "@/db/models/order.model";
import { fulfillOrderPayment } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const orderId = charge.metadata.orderId;
    const email = charge.billing_details.email;
    const pricePaidInCents = charge.amount;
    const order = await Order.findById(orderId).populate("user", "email");
    if (order == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    // Stripe can and does redeliver the same event; without this guard a
    // duplicate delivery would decrement stock and count a sale twice for
    // the same order.
    if (order.isPaid) {
      return NextResponse.json({ message: "Order already paid" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: event.id,
      status: "COMPLETED",
      email_address: email!,
      pricePaid: (pricePaidInCents / 100).toFixed(2),
    };
    await order.save();
    if (!process.env.MONGODB_URI?.startsWith("mongodb://localhost")) {
      await fulfillOrderPayment(order._id.toString());
    }
    try {
      await sendPurchaseReceipt({ order });
    } catch (err) {
      console.log("email error", err);
    }
    return NextResponse.json({
      message: "updateOrderToPaid was successful",
    });
  }
  return new NextResponse();
}
