import express from 'express';
import { apiRouter } from '../server/apiRouter';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount router on both /api and root /
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default function handler(req: any, res: any) {
  return app(req, res);
}
