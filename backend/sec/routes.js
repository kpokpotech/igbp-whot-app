import express from "express";
const router = express.Router();

// In-memory users (replace with DB)
const users = new Map();

router.post('/login', (req,res)=>{
  const { username } = req.body;
  if (!username) return res.status(400).json({error:"Aha achọrọ"});
  const u = users.get(username) || { username, wins:0, level:"Onye Mbido" };
  users.set(username, u);
  res.json({ message:`Nnọọ, ${username}`, user: u });
});

router.post('/win', (req,res)=>{
  const { username, winner } = req.body;
  const u = users.get(username);
  if (!u) return res.status(404).json({error:"Onye ọrụ adịghị"});
  if (winner==="player") u.wins++;
  if (u.wins >= 100) u.level = "Onye Ndu ⭐";
  else if (u.wins >= 50) u.level = "Okaa Mmụta";
  else if (u.wins >= 10) u.level = "Onye Mbido";
  users.set(username, u);
  res.json(u);
});

router.get('/profile/:username',(req,res)=>{
  const u=users.get(req.params.username);
  if (!u) return res.status(404).json({error:"Onye ọrụ adịghị"});
  res.json(u);
});

export default router;