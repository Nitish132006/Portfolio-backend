import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await resend.emails.send({
      from: "Nitish Contact Form <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New message from ${name}`,
      text: `Email: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Failed to send email." });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log("✅ Server running on port", process.env.PORT || 5000)
);
