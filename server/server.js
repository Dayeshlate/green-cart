import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./Routes/userRoute.js";
import sellerRouter from "./Routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import ProductRouter from "./Routes/ProductRoute.js";
import cartRouter from "./Routes/CartRoute.js";
import addressRouter from "./Routes/AddressRoute.js";
import orderRouter from "./Routes/OrderRoute.js";
import { stripeWebHook } from "./Controllers/OrderController.js";

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

/* =========================
   STRIPE WEBHOOK (RAW BODY)
   MUST BE FIRST
========================= */
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebHook
);

/* =========================
   NORMAL MIDDLEWARE
========================= */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,   // allow all origins automatically
    credentials: true,
  })
);

/* =========================
   INIT SERVICES
========================= */
await connectDB();
await connectCloudinary();

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => res.send("API IS WORKING"));

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", ProductRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

/* =========================
   SERVER
========================= */
app.listen(port, () =>
  console.log(`🚀 SERVER IS RUNNING ON ${port}`)
);
