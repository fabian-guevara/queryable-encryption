import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createUser, findUser, findUsersByDobRange } from "./qe.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.post("/api/patients", async (req, res) => {
  try {
    const { name, dob, ssn } = req.body;
    const parsedUser = {
      name,
      dob: new Date(dob),
      dob_unencrypted: new Date(dob),
      patientRecord: {
        ssn,
        ssn_unencrypted: ssn,
        billing: {
          type: "visa",
          number: "1000 1000 1000 1000",
        },
        billAmount: Math.floor(Math.random() * 100000),
      },
    }
    const result = await createUser(parsedUser);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.get("/api/patients", async (req, res) => {
  const ssn = req.query.search;
  const user = await findUser(ssn);
  console.log(user);

  user ? res.status(200).json([user]) : res.status(200).json([])
})

app.get("/api/patients_range", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Missing start or end date." });
  }

  try {
    const users = await findUsersByDobRange(start, end);
    res.status(200).json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error." });
  }
});

// Start server
app.listen(port, async () => {
  try {
    console.log(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    console.error("❌ Failed to connect to start the server:", err);
  }
});
