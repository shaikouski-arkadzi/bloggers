import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 10_000;
const MAX_ATTEMPTS = 5;

let attempts: { ip: string; time: number }[] = [];

export const loginRateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip;

  if (!ip) {
    res.sendStatus(500);
    return;
  }

  const now = Date.now();

  attempts = attempts.filter((item) => item.time > now - WINDOW_MS);

  attempts.push({ ip, time: now });

  if (attempts.filter((item) => item.ip === ip).length > MAX_ATTEMPTS) {
    res.sendStatus(429);
    return;
  }

  next();
};
