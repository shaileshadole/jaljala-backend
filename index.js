import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
// CORS setup for frontend at localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const API_MODEL = "gemini-2.5-flash"; // or "gemini-pro" if previously used
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(URL, {
      contents: [{ parts: [{ text: message }] }],
    });

    const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.log("ERRROR: " + error);
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
