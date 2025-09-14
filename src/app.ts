import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './api/auth/auth.route';
import { healthCheckController } from './api/auth/auth.controller';

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.get('/', healthCheckController);

export default app;
