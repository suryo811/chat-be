import express from 'express';
import type { Application, Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import Routes from './routes/index.js';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// health check
app.get('/health', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/api', Routes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
