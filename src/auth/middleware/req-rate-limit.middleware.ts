import { Request, Response, NextFunction } from "express";

const WINDOW_MS = 10_000;
const MAX_ATTEMPTS = 5;

let attempts: { ip: string; route: string; time: number }[] = [];

export const resetReqRateLimit = () => {
  attempts = [];
};

export const reqRateLimitMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip;
  const route = `${req.method}:${req.baseUrl}${req.path}`;

  if (!ip) {
    res.sendStatus(500);
    return;
  }

  const now = Date.now();

  attempts = attempts.filter((item) => item.time > now - WINDOW_MS);

  attempts.push({ ip, route, time: now });

  const count = attempts.filter(
    (item) => item.ip === ip && item.route === route,
  ).length;

  if (count > MAX_ATTEMPTS) {
    res.sendStatus(429);
    return;
  }

  next();
};
