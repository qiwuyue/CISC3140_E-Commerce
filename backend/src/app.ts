import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import { stripeWebhook } from "./controllers/stripeWebhookController.js";
const app = express();

app.use(cors());

app.post(
  "/api/webhooks/stripe",
  express.raw({
    type: "application/json",
  }),
  stripeWebhook
);
app.use(express.json());

app.use("/api", routes);

export default app;