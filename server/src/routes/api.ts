import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

export default router;