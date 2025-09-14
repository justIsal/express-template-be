import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './api/auth/auth.route';

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to E-Commerce API!' });
});

export default app;
