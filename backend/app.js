const express = require("express");
const bodyParser = require("body-parser");
const speakeasy = require("speakeasy");
const cors = require("cors");
const twilio = require("twilio");
const dotenv = require('dotenv')

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const secrets = {};

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.post("/send-otp", (req, res) => {
  console.log("Received request to send OTP");
  const phoneNumber = req.body.phoneNumber;

  const secret = speakeasy.generateSecret();

  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });

  secrets[phoneNumber] = { secret, otp };

  // Use Twilio to send SMS
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message) => console.log(`SMS sent with SID: ${message.sid}`))
    .catch((error) => console.error(`Error sending SMS: ${error.message}`));

  console.log(`OTP for ${phoneNumber}: ${otp}`);

  // Corrected the response to include both message and otp in a single object
  res.status(200).json({ message: "OTP sent successfully", otp });
});

app.post("/verify-otp", (req, res) => {
  console.log("Received request to verify OTP");
  const phoneNumber = req.body.phoneNumber;
  const userEnteredOTP = req.body.otp;

  // Log the received OTP
  console.log("User entered OTP:", userEnteredOTP);

  // Periksa apakah secrets[phoneNumber] terdefinisi
  if (secrets[phoneNumber]) {
    const storedSecret = secrets[phoneNumber].secret;

    const isValidOTP = speakeasy.totp.verify({
      secret: storedSecret.base32,
      encoding: "base32",
      token: userEnteredOTP,
    });

    if (isValidOTP) {
      res.status(200).json({ success: true, message: "OTP is valid" });
    } else {
      res.status(400).json({ success: false, message: "OTP is invalid" });
    }
  } else {
    res.status(400).json({ success: false, message: "Please send OTP first" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
