const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let users = []; // temp storage, replace later with database

// Login endpoint
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Aha achọrọ (username required)" });

  let user = users.find(u => u.username === username);
  if (!user) {
    user = { username, wins: 0, level: "Onye Mbido" };
    users.push(user);
  }

  res.json({ message: `Nnọọ, ${username}`, user });
});

// Record a win
app.post("/win", (req, res) => {
  const { username } = req.body;
  let user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.wins++;
  if (user.wins >= 100) user.level = "Onye Ndu ⭐";
  else if (user.wins >= 50) user.level = "Okaa Mmụta";
  else if (user.wins >= 10) user.level = "Onye Mbido";

  res.json(user);
});

app.listen(5000, () => console.log("Igbo Whot backend running on port 5000"));