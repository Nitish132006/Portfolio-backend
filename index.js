import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();

// ✅ Allow your Vercel frontend
const allowedOrigins = [
  "https://portfolio-frontend-gamma-five.vercel.app", // your live frontend
  "http://localhost:5173" // optional: for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Nitish Portfolio <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("✅ Server running on port", process.env.PORT || 5000)
);
