import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
const PORT = process.env.PORT || 5173;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({ windowMs: 60*1000, max: 120 }));

app.use('/api', routes);

app.listen(PORT, ()=> console.log(`Igbo Whot backend running @ ${PORT}`));