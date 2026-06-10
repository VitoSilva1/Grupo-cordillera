import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { createRoutes } from './routes.js';
import { errorMiddleware } from './shared/middlewares/error.middleware.js';

const app = express();

app.use(cors({ origin: env.allowedOrigins }));
app.use(express.json());

app.use(createRoutes());
app.use(errorMiddleware);

export default app;
