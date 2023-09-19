const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGINS.split(" "),
  })
);

app.get("/", (req, res) => {
  res.send("Server is up and running 🚀");
});

app.post("/api/email/send", async (req, res) => {
  try {
    const { emailBody, emailSubject, reciever, apiKey } = req.body;

    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ message: "Invalid api key provided" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `Portfolio ${process.env.SENDER_EMAIL}`,
      to: reciever,
      subject: emailSubject,
      html: emailBody,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
