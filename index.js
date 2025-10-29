import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();

// ✅ Allow your Vercel frontend and local dev
const allowedOrigins = [
  "https://portfolio-frontend-gamma-five.vercel.app", // your live frontend
  "http://localhost:5173", // for local testing
];

app.use(
  cors({
    origin: function (origin, callback) {
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

// ✅ Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Contact route
app.post("/send-message", async (req, res) => {
  console.log("📩 Received contact form submission:", req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log("⚠️ Missing required fields");
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  try {
    const result = await resend.emails.send({
      from: "Nitish Portfolio <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    console.log("📨 Email send result:", result);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Email send failed:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

// ✅ Start server
app.listen(process.env.PORT || 5000, () =>
  console.log("✅ Server running on port", process.env.PORT || 5000)
);

console.log("🔑 Using Resend key:", process.env.RESEND_API_KEY ? "Loaded" : "Missing");
console.log("📬 Sending to:", process.env.EMAIL_TO);
