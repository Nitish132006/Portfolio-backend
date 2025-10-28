import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();

app.use(express.json());

// ✅ FIXED: Proper CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://portfolio-frontend-gamma-five.vercel.app", // deployed frontend
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Portfolio backend is running ✅");
});

// ✅ Send message route
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "nitishm132006@gmail.com",
      subject: `New message from ${name}`,
      html: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
